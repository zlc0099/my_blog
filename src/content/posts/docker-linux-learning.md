---
title: "Docker 与 Linux 学习记录：容器背后的系统知识与排错"
slug: "docker-linux-learning"
date: "2026-10-27"
updated: "2026-10-27"
category: notes
tags: [docker, linux, containers, troubleshooting, devops]
prompts: []
summary: "Docker 不是轻量虚拟机，而是 Linux 的命名空间、cgroups 和分层文件系统组合出来的进程隔离。先把 Linux 的权限、进程、网络、磁盘和日志理清，再理解镜像、容器、网络、存储与 Compose，最后整理一套容器排错顺序和 16 个常见疑惑。"
---

Docker 用久了会发现，很多「容器问题」最后都落到 Linux 上：端口映射不生效是 iptables 和网络命名空间，容器写出来的文件是 root 所有是 UID 映射，容器被 kill 是 cgroup 内存限制，磁盘满了是 overlay2 和日志。

所以这篇不单独讲 Docker 命令，而是把 Linux 基础和容器机制放在一起：先知道宿主机上发生了什么，再看容器这一层做了什么。

## 一、Docker 到底是什么

一句话：**容器是受命名空间隔离、受 cgroups 限制、使用独立根文件系统的进程**。

- **namespaces** 负责隔离：PID、网络、挂载点、主机名、IPC、用户、cgroup。
- **cgroups** 负责限额：CPU、内存、进程数、IO。
- **UnionFS / overlay2** 负责镜像分层和容器可写层。

因此容器共享宿主机内核，启动快、密度高，但隔离性弱于虚拟机。容器里看到的 `/proc`、内核版本、系统调用都是宿主机的；Windows / macOS 上的 Docker Desktop 实际上先跑了一个 Linux 虚拟机，再在虚拟机里跑容器。

这也解释了两个常见现象：

- 容器里不能随便换内核，也不能运行与宿主内核不兼容的模块。
- 「容器里是 root」并不等于「和宿主机完全隔离」，默认情况下 UID 0 映射到宿主机的 UID 0，只是 capabilities 被裁剪了。

## 二、Linux 必备基础

### 1. 文件系统与路径

Linux 把设备、进程、网络都抽象成文件。常见目录：

| 路径 | 用途 |
|---|---|
| `/etc` | 系统和应用配置 |
| `/var` | 可变数据，日志、缓存、数据库文件 |
| `/usr` | 系统和软件资源 |
| `/opt` | 额外安装的软件 |
| `/home` | 普通用户目录 |
| `/tmp` | 临时文件，可能被清理 |
| `/proc`、`/sys` | 内核和进程的运行时信息 |

排错时经常要区分「配置在哪」「数据在哪」「日志在哪」。容器里也一样，只是这些路径来自镜像的根文件系统。

### 2. 权限与用户

`ls -l` 的三组权限分别对应所有者、所属组、其他人：

```text
-rwxr-x---  1 app app  1024 Oct 27 10:00 start.sh
```

- `r` 读、`w` 写、`x` 执行；目录的 `x` 表示能进入。
- `chmod 750 file`：所有者读写执行，组读执行，其他人无权限。
- `chown app:app file`：修改所有者和组。
- 新建文件的默认权限受 `umask` 影响，常见 `022` 会得到 `644` / `755`。

最常见的权限坑不是文件本身，而是父目录缺少 `x`，或者容器里的 UID 和宿主机挂载目录的 UID 不一致。SELinux / AppArmor 开启时，权限位对了也可能被安全策略拦住。

### 3. 进程与信号

```bash
ps aux | grep java
pgrep -af java
top -p <pid>
kill -TERM <pid>
```

- `SIGTERM`（15）是礼貌请求退出，程序可以清理资源；`SIGKILL`（9）无法被捕获，是最后手段。
- 退出码 `128 + 信号编号`：137 = 128 + 9，143 = 128 + 15。
- `Ctrl+C` 发送 `SIGINT`；`Ctrl+Z` 只是挂起，不是结束。
- `nohup cmd &` 让进程忽略挂断信号并在后台运行；生产环境更推荐 systemd 或容器编排管理进程。

容器的 PID 1 就是主进程。如果主进程不处理 `SIGTERM`，`docker stop` 等超时后会 `SIGKILL`，表现为退出码 137。Java 应用要确保注册了关闭钩子，shell 形式的启动脚本也要注意信号转发。

### 4. 服务与日志

现代 Linux 服务通常由 systemd 管理：

```bash
systemctl status docker
systemctl restart docker
systemctl enable docker
journalctl -u docker --since "10 min ago" -f
```

改完 unit 文件要 `systemctl daemon-reload`。日志除了 `journalctl`，还可能在 `/var/log` 下；排查顺序是「应用日志 → 服务日志 → 系统日志（`dmesg`）」。

### 5. 网络

```bash
ip addr
ip route
ss -lntp
curl -v http://127.0.0.1:8080/health
dig example.com
```

- `ss -lntp` 看谁在监听哪个端口，端口冲突时比 `netstat` 更直接。
- `curl -v` 能区分 DNS、TCP、TLS、HTTP 哪一层失败。
- DNS 配置在 `/etc/resolv.conf`，本地解析在 `/etc/hosts`。
- 防火墙可能是 `iptables`、`nftables`、`firewalld` 或 `ufw`，不同发行版不一样。

### 6. 磁盘、内存与文件句柄

```bash
df -h
df -i
du -sh /var/* | sort -h
free -h
vmstat 1
iostat -xz 1
lsof +L1
```

`df` 和 `du` 对不上时，常见原因是「文件已删除但进程还持有句柄」，用 `lsof +L1` 找；`df -i` 用完后即使还有空间也无法创建新文件。`free` 的 `available` 比 `free` 更有参考价值，page cache 不是「被吃掉了」。

## 三、Docker 核心概念

### 镜像、容器、层

- **镜像**：只读模板，由多条指令形成多层。
- **容器**：镜像 + 一层可写层 + 运行时配置。
- **仓库**：存放镜像的地方，tag 可变，digest 不可变。生产环境建议固定 digest，避免「同一个 tag 拉出来不一样」。

```bash
docker pull nginx:1.27
docker images
docker run -d --name web -p 8080:80 nginx:1.27
docker ps
docker logs -f --tail=200 web
docker exec -it web sh
docker inspect web
docker stats --no-stream
```

`docker run` 是「创建 + 启动」，`docker exec` 是在已运行的容器里再开一个进程。`exec` 只适合排查，不要把启动服务的逻辑放在 `exec` 里。

### 生命周期与清理

```bash
docker stop web
docker start web
docker restart web
docker rm web
docker rm -f web
docker container prune
```

`docker rm` 默认删不掉运行中的容器，`-f` 会强制停止再删除。删除容器会丢掉可写层里没有落到 volume 的数据。

## 四、Dockerfile

### 分层缓存与构建顺序

每条 `RUN`、`COPY`、`ADD` 都会形成一层。缓存命中的关键是「指令和输入没变」，所以依赖文件先拷贝、源码后拷贝：

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd -r -u 10001 appuser
COPY --from=build /src/target/*.jar app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "/app/app.jar"]
```

多阶段构建把编译工具链留在构建阶段，运行镜像只保留 JRE 和 jar，体积和攻击面都会小很多。`.dockerignore` 要排除 `target/`、`node_modules/`、`.git/` 和本地配置文件，否则构建上下文会白白变大，缓存也容易失效。

### CMD 与 ENTRYPOINT

- `ENTRYPOINT` 定义容器启动时固定执行的命令。
- `CMD` 提供默认参数，`docker run image arg` 会覆盖 `CMD`，但不会覆盖 `ENTRYPOINT`。
- 尽量用 exec 形式（`["java", "-jar", "..."]`），shell 形式会多一层 `/bin/sh -c`，信号和退出码容易出问题。

### 健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/actuator/health || exit 1
```

健康检查命令必须在镜像里存在。很多 slim 镜像没有 `curl`，写 `curl` 会一直 unhealthy；用 `wget` 或应用自带的健康检查命令。

## 五、网络、存储与资源

### 网络

| 模式 | 特点 |
|---|---|
| `bridge` | 默认模式，容器有独立网络命名空间，通过端口映射暴露 |
| `host` | 直接使用宿主网络，Linux 原生支持；Docker Desktop 运行在虚拟机里，语义和启用方式不同，通常仍以端口映射为主 |
| `none` | 只有 loopback，适合完全隔离的任务 |
| `overlay` | 跨主机网络，Swarm / 编排环境使用 |

自定义 bridge 网络里的容器可以用**服务名/容器名做 DNS** 互访；默认 bridge 只能靠 IP。端口映射是 `-p 宿主端口:容器端口`，只写一个端口表示随机宿主端口。

### 存储

| 方式 | 数据在哪 | 适合 |
|---|---|---|
| 容器可写层 | 容器内部 | 临时文件，删除容器即丢失 |
| named volume | Docker 管理的数据目录 | 数据库、需要持久化的业务数据 |
| bind mount | 宿主机指定路径 | 配置文件、开发时代码挂载 |
| tmpfs | 内存 | 临时敏感数据、缓存 |

bind mount 的权限由宿主机目录的 UID/GID 决定；容器默认以 root 写入时，宿主机上会出现 root 所有的文件。可以用 `--user $(id -u):$(id -g)` 运行，或提前把目录权限配好。SELinux 环境下可能还需要 `:z` / `:Z` 标签。

### 资源限制与 OOM

```bash
docker run -d --name app \
  --memory=1g --cpus=1.5 --pids-limit=256 \
  --restart=unless-stopped \
  my-app:1.0
```

容器超过内存限制会被内核 OOM Killer 杀掉，退出码 137。排查：

```bash
docker inspect -f '{{.State.ExitCode}} {{.State.OOMKilled}}' app
docker stats --no-stream
dmesg -T | tail -50
```

Java 容器要使用容器感知的堆配置，例如 `-XX:MaxRAMPercentage=75`，不要写死一个比容器上限还大的 `-Xmx`。`--memory` 统计的是 cgroup 内存，包含页缓存，实际可用堆还要给元空间、线程栈和直接内存留空间。

### 日志

Docker 默认 `json-file` 日志不会自动轮转，长期运行会把磁盘写满。给守护进程或单个容器配置上限：

```bash
docker run -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  my-app:1.0
```

生产环境也可以把日志交给集中式日志系统，但本地仍要保留可排查的最近日志。

## 六、Docker Compose

Compose 适合本地开发和单机部署，用一个 YAML 描述多个服务、网络和卷：

```yaml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      TZ: Asia/Shanghai
    env_file:
      - .env
    volumes:
      - app-data:/data
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:8080/actuator/health"]
      interval: 30s
      timeout: 3s
      retries: 3
    restart: unless-stopped
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: app
      MYSQL_USER: app
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - db-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1"]
      interval: 10s
      timeout: 5s
      retries: 10

volumes:
  app-data:
  db-data:
```

几个细节：

- `depends_on` 只保证启动顺序，不等于依赖已经可用；需要 `condition: service_healthy` 加健康检查，或者应用内重试。
- `docker compose stop` 停止但保留容器；`docker compose down` 删除容器和网络，`down -v` 还会删除命名卷，执行前确认数据。
- Compose 不是生产编排器，多机、滚动发布、自动扩缩容需要 Kubernetes / Swarm / 云平台。
- 密码不要写进镜像或提交到仓库，用 `.env`（加入 `.gitignore`）、Docker secrets 或外部密钥管理。

## 七、安全边界

- 容器里的 root 默认就是宿主机的 UID 0（除非启用 user namespace remap 或 rootless），只是 capabilities 被裁剪。不要把「反正是容器」当成安全边界。
- 不要挂载 `/var/run/docker.sock` 给业务容器，这等于把宿主机 root 权限交出去。
- `--privileged` 会放开几乎全部能力，除非明确需要，不要使用。
- 生产镜像用非 root 用户、只读根文件系统、`--cap-drop=ALL`、`no-new-privileges`，并按需加回能力。
- 不要把密钥写进 `ENV`、`ARG` 或镜像层，构建历史里能看到；用运行时注入或 secret 管理。
- 使用可信基础镜像，固定版本或 digest，定期扫描漏洞；及时升级宿主机内核，因为容器共享内核。
- Docker 组的成员基本等同于 root，能控制 Docker 就能挂载宿主机文件系统；不要随意把用户加入 `docker` 组。需要低权限时考虑 rootless 模式或 Podman。

## 八、一套排错顺序

遇到容器问题时，我按下面的顺序走，避免一上来就重启：

1. `docker ps -a`：容器是退出、重启循环还是根本没创建？
2. `docker logs --tail=200 <name>`：应用有没有报错？启动脚本是否执行？
3. `docker inspect <name>`：看 `State.ExitCode`、`OOMKilled`、`Mounts`、`NetworkSettings`、`Config`。
4. `docker stats --no-stream`：CPU、内存是否打满？
5. `docker exec -it <name> sh`：容器内能否解析 DNS、访问依赖、读取配置？distroless 没有 shell，就换调试镜像或从宿主机用 `nsenter`。
6. 宿主机：`df -h`、`df -i`、`free -h`、`ss -lntp`、`dmesg -T`、`journalctl -u docker`。
7. 最后才考虑重启或重建，并确认数据卷和配置不会丢失。

常见现象和处理：

| 现象 | 优先检查 |
|---|---|
| 容器启动后立刻退出 | 主进程是否前台运行、`docker logs`、入口脚本、配置文件 |
| 端口被占用或访问不到 | `ss -lntp`、`-p` 映射、防火墙、容器监听地址是否 `127.0.0.1` |
| 容器内 DNS / 外网失败 | `/etc/resolv.conf`、自定义网络、代理变量、宿主机防火墙 |
| 磁盘满 | `docker system df`、日志大小、镜像/构建缓存、volume、`lsof +L1` |
| Permission denied | UID/GID、父目录权限、SELinux/AppArmor、只读挂载、capabilities |
| 时间不对 | `TZ`、`/etc/localtime`、镜像是否安装 tzdata、JVM 时区 |
| 退出码 137 | `OOMKilled`、容器内存限制、JVM 堆、宿主机 OOM |
| 退出码 143 | 收到 SIGTERM，检查停止流程和优雅关闭 |

## 九、常见疑惑

**1. Docker 是轻量虚拟机吗？**

不是。虚拟机有独立内核和完整操作系统，容器共享宿主内核，只做进程级隔离和资源限制。容器更轻、更快，但隔离性和内核兼容性不如虚拟机。

**2. 容器里的 root 是宿主机 root 吗？**

默认情况下 UID 0 映射到宿主机 UID 0，只是 capabilities 被裁剪。挂载宿主机目录、`--privileged`、挂载 docker.sock 都可能突破边界。生产要用非 root 用户、capabilities 限制、rootless 或用户命名空间。

**3. 容器删了数据去哪了？**

写在容器可写层的数据随容器删除而丢失；命名卷和 bind mount 的数据还在。数据库、上传文件不要只写在可写层。

**4. CMD 和 ENTRYPOINT 有什么区别？**

`ENTRYPOINT` 是固定入口，`CMD` 是默认参数；`docker run image arg` 覆盖 `CMD`，不覆盖 `ENTRYPOINT`。需要用户可替换命令时用 `CMD`，需要固定启动逻辑时用 `ENTRYPOINT`。

**5. COPY 和 ADD 怎么选？**

优先 `COPY`，语义清晰。`ADD` 还会处理本地 tar 自动解压和远程 URL，行为更隐式，容易产生意外。

**6. depends_on 能保证依赖服务就绪吗？**

不能。它只控制启动顺序。需要健康检查 `condition: service_healthy`，应用侧也要有连接重试和超时。

**7. 为什么容器一启动就退出？**

容器的主进程在前台结束，容器就结束。常见原因：启动脚本最后一行是后台运行、配置文件错误、依赖连不上、入口命令写错。先看 `docker logs`，再用 `--entrypoint sh` 进镜像排查。

**8. 端口映射了为什么还是访问不到？**

确认容器内监听的是 `0.0.0.0` 而不是 `127.0.0.1`；确认宿主机端口没有被占用；确认防火墙/安全组放行；Docker Desktop 和远程宿主机的访问地址不同。

**9. 容器里连不上外网或 DNS 解析失败？**

检查 `/etc/resolv.conf`、Docker 的 DNS 配置、代理环境变量、宿主机防火墙和上游 DNS。自定义 bridge 网络通常比默认 bridge 的 DNS 行为更可预期。

**10. 为什么容器时间不对？**

基础镜像可能没有 tzdata，或者没有设置 `TZ`。设置 `TZ=Asia/Shanghai`、挂载 `/etc/localtime:ro`，Java 再加 `-Duser.timezone=Asia/Shanghai`。

**11. 退出码 137 和 143 分别是什么意思？**

137 = 128 + 9，通常是 SIGKILL，常见于 OOM 或 `docker kill`；143 = 128 + 15，收到 SIGTERM，通常是正常停止流程。用 `docker inspect` 看 `OOMKilled` 才能确认是不是内存问题。

**12. Docker 占了很大磁盘，能直接 prune 吗？**

先 `docker system df` 看空间分布，再决定清理镜像、构建缓存、停止的容器还是卷。`docker system prune -a --volumes` 会删除所有未使用镜像和卷，生产环境不要随手执行。

**13. 容器里没有 ps、vim、curl 怎么办？**

优先用镜像内已有的工具或从宿主机排查；调试时可以临时起一个带工具的 sidecar 容器共享网络/进程命名空间，或使用 `nsenter`。不要把调试工具塞进生产镜像，distroless 的初衷就是减少攻击面。

**14. 为什么镜像这么大？**

常见原因：没有多阶段构建、把构建工具和缓存带进运行镜像、没有 `.dockerignore`、包管理器缓存没清理、基础镜像本身过大。用 `docker history` 或 `dive` 看层，再逐层瘦身。

**15. Docker 一定要 root 吗？docker 组安全吗？**

运行 Docker 守护进程传统上需要 root；可以用 rootless 模式降低风险。把用户加入 `docker` 组基本等同于给他 root 权限，因为可以直接挂载宿主机根目录。不要把 `docker` 组当成普通权限组。

**16. df 和 du 为什么对不上？**

文件被删除但进程仍持有句柄时，`du` 看不到、`df` 仍计入；也可能是挂载点、稀疏文件或容器层的影响。用 `lsof +L1` 找已删除但仍打开的文件，再重启对应进程释放空间。

## 十、小结

Docker 的很多问题，答案都在 Linux：

- 容器是进程，不是虚拟机；PID 1、信号和退出码要按进程来理解。
- 网络问题回到命名空间、端口监听、DNS 和防火墙。
- 存储问题回到挂载、UID/GID 和可写层的生命周期。
- 资源和稳定性问题回到 cgroups、OOM 和日志轮转。

我的使用顺序是：先用 Linux 工具确认宿主机状态，再用 `docker ps / logs / inspect / stats / exec` 缩小到容器，最后才重建。能解释清楚「数据在哪、进程是谁、限制是什么」，大部分容器故障就不用靠重启碰运气了。

## 参考

- [Docker 官方文档](https://docs.docker.com/)
- [Dockerfile 参考](https://docs.docker.com/reference/dockerfile/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Linux man-pages](https://man7.org/linux/man-pages/)
- [systemd 手册](https://www.freedesktop.org/software/systemd/man/latest/)
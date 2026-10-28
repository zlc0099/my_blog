---
title: "Spring Cloud Alibaba 组件地图：分工与常见疑惑解答"
slug: "spring-cloud-alibaba-components"
date: "2026-10-27"
updated: "2026-10-27"
category: notes
tags: [spring-cloud-alibaba, nacos, sentinel, seata, rocketmq, microservices]
prompts: []
summary: "把 Spring Cloud Alibaba 当成一套按 Spring Cloud 标准落地的实现来理解：Nacos 管注册与配置，Sentinel 管流量与熔断，Seata 管分布式事务，RocketMQ 管异步与最终一致，Dubbo / OpenFeign 管服务调用；后半部分整理了 12 个选型和排错时真正会卡住的疑惑。"
---

微服务组件列表很容易背，难的是知道每个组件在什么位置、什么时候该用、什么时候不该用。这篇是我对 Spring Cloud Alibaba 这套栈的整理：先逐个说清组件分工，再把实际选型和排错时遇到的疑惑列出来。

## 先分清三层关系

- **Spring Boot** 是地基：自动装配、起步依赖、外部化配置。
- **Spring Cloud** 是标准与抽象：服务发现（`DiscoveryClient`）、配置中心（`Config`）、客户端负载均衡（`LoadBalancer`）、声明式调用（`OpenFeign`）、熔断器（`CircuitBreaker`）、消息抽象（`Stream`）。
- **Spring Cloud Alibaba** 是按这些标准提供的实现与集成，另外补充了标准之外的组件（Seata 分布式事务、SchedulerX 调度、OSS / SMS 云能力）。

所以迁移时通常是「换底座不换代码」：把 Eureka 换成 Nacos，业务代码里的 `DiscoveryClient`、`LoadBalancer`、`OpenFeign` 基本不动；而 Seata、SchedulerX 这类不属于 Spring Cloud 抽象的能力，才会带来新的编程模型。

版本必须按官方对照表对齐，用 BOM 统一管理，不要单独升某个组件的小版本。以 2023.0.x 为例，对应 Spring Cloud 2023.0.x、Spring Boot 3.2.x，Nacos 2.3.x、Sentinel 1.8.x、Seata 2.x、RocketMQ 5.x。Boot 3 还要注意 `javax.*` 换成 `jakarta.*`。

## 组件分工

### Nacos：注册中心 + 配置中心

一个进程两种能力，依赖也是分开的（`nacos-discovery` 和 `nacos-config`），可以只用其中一种。

**注册中心**

- 临时实例靠心跳/长连接保活，失联被剔除；持久实例不剔除，只标记不健康。
- 临时实例走 Distro 协议（AP，可用性优先），持久实例走 Raft（CP，一致性优先）。
- 2.x 客户端与服务端改用 gRPC 长连接，除了 8848 还要放通 9848（客户端）和 9849（集群），这是内网能通、容器里连不上的高频原因。

**配置中心**

- 三级隔离：namespace 隔离环境（dev / test / prod），group 区分项目或模块，dataId 区分具体配置。
- 优先级：默认 dataId（`${prefix}.${file-extension}`）> `extension-configs` > `shared-configs`；同一类里下标越小优先级越高。
- Spring Cloud 2021 之后不再默认启用 bootstrap，新写法是在 `application.yml` 里用 `spring.config.import` 引入，动态刷新用 `@RefreshScope` 或 `@ConfigurationProperties`。

```yaml
spring:
  application:
    name: order-service
  config:
    import:
      - optional:nacos:order-service.yaml
  cloud:
    nacos:
      server-addr: 127.0.0.1:8848
      config:
        namespace: dev
        group: DEFAULT_GROUP
      discovery:
        namespace: dev
```

### Sentinel：流量控制与熔断降级

定位不只是「熔断」，而是四个方向：

- 流控：QPS / 线程数，直接、关联、链路三种模式。
- 熔断：慢调用比例、异常比例、异常数三种策略。
- 热点参数限流：按参数值单独限流，比如某商品 ID 被刷。
- 系统自适应保护：按 load、CPU、入口 RT、线程数兜底。

关键点：**规则默认只存在内存里**。控制台改的规则重启就没了，生产要把规则持久化到 Nacos（推模式）或数据库；`@SentinelResource` 用来给方法定义资源和 `blockHandler` / `fallback`。

### Seata：分布式事务

角色有三个：TC（协调者，独立部署的 Server）、TM（发起全局事务，`@GlobalTransactional` 所在的方法）、RM（分支事务，被代理的数据源）。

四种模式：

- **AT**：默认模式，非侵入。一阶段拦截业务 SQL，记录前后镜像到 `undo_log`，提交本地事务并注册分支；二阶段全局提交就异步删日志，回滚就拿 `undo_log` 反向补偿。默认隔离级别是读未提交，想避免脏读要配合全局锁。
- **TCC**：Try / Confirm / Cancel 三个方法自己写，业务侵入大，要处理空回滚、悬挂和幂等。
- **SAGA**：长流程编排，正向服务加补偿服务。
- **XA**：数据库层两阶段，强一致但性能差，一般能 AT 就不选 XA。

每个业务库都要建 `undo_log` 表；`@GlobalTransactional` 只标在入口方法上；XID 在 Feign / Dubbo 调用里会自动传递，走 MQ 的场景要手动带。

### RocketMQ：异步、削峰与最终一致

- 事务消息：半消息 + 本地事务 + commit / rollback，失败时 Broker 回查本地事务状态。它保证的是「本地事务和发消息」原子，不保证下游业务回滚。
- 延时消息、顺序消息（同一业务键进同一队列）、重试与死信：消费失败重试到上限后进死信队列。
- **消费端必须幂等**：消息至少投递一次，重复消费是常态，用业务唯一键或状态机去重。
- 接入方式：`rocketmq-spring-boot-starter` 直接发消息，或 Spring Cloud Stream 的 RocketMQ Binder 走统一消息抽象。

### Dubbo 与 OpenFeign：两种服务调用

- OpenFeign：HTTP + JSON，声明式接口，和 Spring Cloud 生态无缝，用 Nacos 做注册发现和 LoadBalancer 做客户端负载均衡。跨团队、跨语言、接口不频繁调用时更合适。
- Dubbo：二进制 RPC，性能更高，支持服务级/应用级发现和 Triple 协议，治理能力更细（超时、重试、负载均衡策略、泛化调用）。内部高频调用、对延迟敏感时更合适。

两者都能注册到 Nacos，也可以在同一个项目里共存，关键是超时和重试都要配幂等，否则重试会放大故障。

### Gateway 与 Cloud 原生组件

- Spring Cloud Gateway：网关层做路由、鉴权、灰度，结合 `sentinel-gateway` 做入口限流。网关的规则和服务内规则是两层，不能互相替代。
- OpenFeign + LoadBalancer：服务间调用，替换掉已停止维护的 Ribbon。

### 云能力集成（按需）

- **SchedulerX**：分布式任务调度，商业化产品（有对应 starter）；本地替代是 XXL-Job，核心都是任务幂等和错过补偿。
- **OSS / SMS**：对象存储和短信的快速接入，属于云能力而非微服务治理。
- **Spring AI Alibaba**：新方向，做 LLM 应用（通义 / DashScope 接入、提示词与可观测），和微服务治理是并列关系，不是替代。

## 疑惑与解答

**1. Spring Cloud Alibaba 是替代 Spring Cloud 吗？**

不是。Spring Cloud 定义标准和抽象，Spring Cloud Alibaba 提供符合标准的实现。用了 Nacos 之后，`DiscoveryClient`、`LoadBalancer`、`OpenFeign` 这些代码不用改，只是底座换了。Seata、SchedulerX 属于标准之外的新增能力。

**2. Nacos 既是注册中心又是配置中心，要部署两套吗？**

不用，一个 Nacos 集群同时提供两种能力，客户端依赖分开引。生产上通常按 namespace 把环境隔开，一个 namespace 一套隔离的服务与配置。

**3. 为什么控制台改的规则、配置重启就没了？**

三个不同层面的持久化要分清：

- Nacos 自己的配置存数据库（生产用 MySQL，不能用内嵌 Derby），默认就会持久化；
- Sentinel 规则默认在客户端内存里，控制台只是把规则推给客户端，必须配 Nacos / 数据库数据源才会持久化；
- 网关路由、Seata 事务分组这类配置，同样要看是放在配置文件还是配置中心。

**4. 服务注册不上去或调用方找不到实例，先查什么？**

按顺序：Nacos 控制台里有没有实例 → namespace 和 group 是否一致 → 服务名大小写 → 注册的 IP 是不是容器/虚拟网卡地址（必要时显式配置 `ip`、`network-interface`）→ 鉴权用户名密码 → 版本是否匹配。2.x 记得放通 9848 端口。

**5. Sentinel、Hystrix、Resilience4j 怎么选？**

Hystrix 已停止维护。Sentinel 侧重流量控制、热点参数和系统自适应保护，规则模型更细；Resilience4j 是 Spring Cloud CircuitBreaker 抽象下的轻量实现，函数式风格。选型看需要的规则模型和团队习惯，不要只看「熔断」这一个点。

**6. 限流熔断应该在网关做还是服务里做？**

两层都要有，职责不同：网关做入口总控、黑名单和公开接口保护；服务自己按容量配置流控和熔断。只在网关做，内网调用没有保护；只在服务做，被打满的是整个入口链路。

**7. 用了 Seata 是不是就不用管幂等和补偿了？**

不是。AT 模式有全局锁和隔离级别的限制；TCC 和 SAGA 本身就是补偿模型，空回滚、悬挂、幂等都要业务处理；跨 MQ 的调用 XID 不会自动传播。分布式事务只用在真正需要强一致的多库写入上，能用本地事务加最终一致性解决的，不要上 Seata。

**8. RocketMQ 事务消息能替代 Seata 吗？**

不能。事务消息只保证「本地事务提交」和「消息发出」的原子性，下游消费失败时不会反向回滚上游。它适合的是一致性要求不极端、可以接受最终一致的场景，配套要做消费幂等、重试上限和对账补偿。

**9. OpenFeign 的超时、重试和 Sentinel 熔断怎么配合？**

先定调用预算：Feign 的连接/读取超时 → LoadBalancer 重试（只对幂等接口）→ 重试耗尽后由 Sentinel 熔断。三者参数要匹配，超时设得太长会把线程占满，重试次数太多会放大下游故障。Ribbon 已经由 LoadBalancer 取代，老教程里的配置项很多失效了。

**10. Nacos 配置不生效、不刷新，怎么排查？**

依赖里有没有 config starter → 有没有写 `spring.config.import` → namespace、group、dataId 拼写和文件后缀对不对（`${prefix}.${file-extension}`）→ 属性类有没有 `@RefreshScope` 或绑定注解 → 是否被本地配置或启动参数覆盖。Spring Cloud 2021 之后还按老教程配 `bootstrap.yml`，是最常见的踩坑点。

**11. 版本到底怎么选？**

按官方对照表选整条链，用 BOM 锁死：Boot 3.2.x 配 Spring Cloud 2023.0.x 和 Spring Cloud Alibaba 2023.0.x；Boot 3.0 / 3.1 配 2022.0.x；Boot 2.6 / 2.7 配 2021.0.x。不要只升 Nacos 客户端或 Sentinel 的小版本，兼容性问题基本都从版本错配来。

**12. 组件是不是都要上？本地要起多少东西？**

不是。最小可用组合是 Nacos + OpenFeign + Gateway；需要入口限流加 Sentinel；需要跨服务异步和最终一致加 RocketMQ；真正遇到多库强一致再加 Seata；Dubbo 视性能需求替换 HTTP 调用。本地开发先起 Nacos 就能跑通大部分功能，其余的按需增加。

## 小结

我目前的理解是：Nacos 统一「服务在哪、配置是什么」，Gateway 和 OpenFeign 负责流量怎么进出，Sentinel 保证容量和故障隔离，RocketMQ 处理异步与最终一致，Seata 只在强一致多库写入时兜底，Dubbo 是按性能和治理需求替换 HTTP 调用的选项。

落地顺序比组件数量重要：先用最小组合把一条业务链路跑通，再按真实问题逐个引入组件。一开始就全家桶，运维成本和排错难度会远超收益。

## 参考

- [Spring Cloud Alibaba 版本发布说明](https://sca.aliyun.com/docs/2023/overview/version-explain/)
- [Nacos Config 快速开始](https://sca.aliyun.com/docs/2023/user-guide/nacos/quick-start/)
- [Nacos 官方文档](https://nacos.io/docs/latest/)
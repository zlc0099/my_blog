---
title: "RabbitMQ 学习记录：消息模型、可靠性与常见答疑"
slug: "rabbitmq-message-reliability"
date: "2026-10-27"
updated: "2026-10-27"
category: notes
tags: [rabbitmq, message-queue, reliability, spring-boot, distributed-systems]
prompts: []
summary: "把 RabbitMQ 拆成生产者、Broker、消费者三段可靠性来理解：交换机与队列、发布确认、手动 ACK、预取、重试与死信、幂等和顺序；再整理 Spring Boot 接入、排查顺序和 16 个实际使用中最容易踩的疑惑。"
---

RabbitMQ 用起来不难：声明交换机、队列、绑定，发消息、收消息，几行代码就能跑。难的是消息丢了、重复了、堆积了、消费失败了之后怎么定位，以及「确认」到底确认到了哪一步。

这篇是我对 RabbitMQ 的整理：先看消息在系统里的完整路径，再按生产者、Broker、消费者三段讲可靠性，最后集中回答实际使用中最容易混淆的问题。

## 它在链路里的位置

RabbitMQ 是消息代理，核心职责是**接收消息、按路由规则投递、在消费者确认前保存消息**。它适合任务队列、异步解耦、通知、削峰和延迟/重试；不适合当数据库，也不是 Kafka 那种以日志回放为核心的流平台。

核心模型：

```text
Producer
  └─ Connection
       └─ Channel
            └─ publish(exchange, routingKey, message)
                 └─ Exchange ──binding──> Queue ──> Consumer
```

几个概念要分清：

- **Connection** 是一条 TCP 连接，建立成本高。
- **Channel** 是连接上的复用通道，发布、消费、声明都走 channel；**channel 不是线程安全的**，不要多线程共用一个。
- **VHost** 是逻辑隔离单元，不同环境或业务可以分开，权限也按 vhost 分配。
- **Exchange** 只负责路由，不存消息；**Queue** 才存消息。
- **Binding** 是交换机和队列之间的路由规则。

生产者通常把消息发给交换机，而不是直接发给队列。默认交换机（名字为空字符串）会用 routing key 等于队列名的方式直接投递，适合简单场景；生产环境更常见的是显式声明交换机、队列和绑定。

## 一条消息的完整路径

1. 生产者构造消息：交换机、routing key、消息属性（持久化、messageId、headers）和消息体。
2. 通过 channel 发布到交换机。
3. 交换机根据类型和 routing key/headers 找到匹配的队列；**没有匹配队列时，消息默认会被丢弃**。
4. 消息进入队列，等待消费者；持久化队列和持久化消息会落盘，quorum queue 会复制到多个节点。
5. 消费者按预取数量拿到消息，执行业务逻辑。
6. 业务成功后 ACK，Broker 删除消息；失败则 NACK/REJECT，选择重新入队或进入死信。
7. 如果开启发布确认，Broker 在处理完后向生产者发送 confirm。

这条链路上任何一步都可能出问题：没有绑定、消息不持久化、自动 ACK、消费者异常后无限重入、Broker 磁盘满、确认没开。可靠性设计就是把每一段都补上。

## 交换机类型

| 类型 | 路由方式 | 典型场景 |
|---|---|---|
| `direct` | routing key 完全匹配 | 按任务类型、业务键精确投递 |
| `fanout` | 忽略 routing key，广播到所有绑定队列 | 通知、缓存刷新、事件广播 |
| `topic` | `*` 匹配一个词，`#` 匹配零到多个词 | `order.created`、`order.*.paid` 这类分级路由 |
| `headers` | 按消息 headers 匹配 | 复杂条件路由，实际使用较少 |

另外还有两个常见概念：

- **Default Exchange**：名字为空，routing key 就是队列名，省去显式绑定，但路由能力有限。
- **Alternate Exchange**：交换机找不到匹配队列时，把消息转到备用交换机，避免静默丢弃。

死信交换机（DLX）本质上也是普通交换机，只是由队列的 `x-dead-letter-exchange` 参数指定，用来接收被拒绝、过期或超长的消息。

## 队列与消息属性

| 属性 | 作用 | 注意 |
|---|---|---|
| `durable` | 队列元数据持久化，重启后队列还在 | 不代表消息持久化 |
| `exclusive` | 只允许声明它的连接使用，连接关闭自动删除 | 适合临时队列，不适合业务队列 |
| `autoDelete` | 最后一个消费者断开后自动删除 | 容易误删，生产慎用 |
| 消息 `deliveryMode=2` | 消息持久化 | 还必须配合 durable 队列和 confirm |
| `x-message-ttl` | 队列级消息存活时间 | 过期可进入 DLX |
| `x-expires` | 队列空闲过期时间 | 和消息 TTL 不是一回事 |
| `x-dead-letter-exchange` | 死信交换机 | 需要同时配置 routing key |
| `x-max-length` | 队列最大长度 | 超出后按 overflow 策略丢弃或拒绝 |
| `x-max-priority` | 优先级队列 | 有额外成本，优先级档位不要太多 |
| `x-queue-type=quorum` | Raft 复制的持久队列 | 高可用首选；不支持 exclusive/auto-delete |
| `x-single-active-consumer` | 同时只有一个消费者活跃 | 保顺序，但吞吐会下降 |

队列类型要按场景选：

- **classic**：单节点、轻量、临时任务；经典镜像队列在新版已经不再是推荐的高可用方案。
- **quorum**：需要副本和故障切换的业务队列，生产环境优先考虑；代价是更重的磁盘和内存开销。
- **stream**：追加日志、可回放、适合大扇出和事件流，不是传统任务队列的替代品。

## 可靠性：生产者、Broker、消费者

### 生产者端

生产者最容易犯的错是「以为发出去了」。TCP 写成功不等于交换机收到，交换机收到也不等于路由成功，路由成功也不等于队列落盘。

要补齐三件事：

1. **发布确认（publisher confirms）**：Broker 确认收到并处理消息；异步 confirm 性能比事务好得多。
2. **mandatory + returns**：消息无法路由时返回给生产者，而不是静默丢弃。
3. **持久化**：durable 交换机、durable 队列、持久化消息，三者缺一不可。

```yaml
spring:
  rabbitmq:
    publisher-confirm-type: correlated
    publisher-returns: true
```

更复杂的业务用 **Outbox（本地消息表）**：业务数据和待发送消息在同一个数据库事务里写入，独立的中继任务负责发送并标记已发送，发送失败可重试。这样避免「数据库提交了、消息没发出去」或「消息发了、数据库回滚了」的双写不一致。

### Broker 端

- 队列和交换机声明为 durable，消息设置持久化。
- 需要高可用时使用 quorum queue，并保证集群至少有足够的节点和副本。
- 监控磁盘、内存、文件句柄和队列积压；RabbitMQ 触发内存或磁盘告警时会阻塞生产者，消费者通常还能继续工作。
- 单节点就是单点故障，备份和恢复演练不能省。
- 集群解决的是节点故障，不是跨地域容灾；跨机房通常用 federation 或 shovel。

### 消费者端

消费端的核心是「业务成功后再确认」：

- **手动 ACK**：业务逻辑和数据库事务提交成功后再 `basicAck`。自动 ACK 在消费者崩溃时会丢消息。
- **幂等**：消息至少投递一次，重复消费是正常现象；用业务唯一键、状态机或去重表保证重复执行不出错。
- **预取（prefetch）**：限制每个消费者手上未确认的消息数，避免一次拉太多把内存和下游打满。
- **失败处理**：区分可重试和不可重试异常；可重试走延迟重试队列，不可重试直接进死信，别用 `requeue=true` 无限循环。
- **死信监控**：DLQ 不是垃圾桶，要有消费者、告警和人工处理入口。
- **顺序**：RabbitMQ 只能保证单队列内的基本顺序，多个消费者并发消费会打乱顺序；需要严格顺序时用单活跃消费者或按业务键分区。

最稳妥的语义是「至少一次投递 + 幂等消费」，不要追求端到端的「恰好一次」。Broker 确认、网络重试和消费者重投都可能带来重复。

## Spring Boot 接入

依赖和常用配置：

```yaml
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: guest
    password: guest
    virtual-host: /
    publisher-confirm-type: correlated
    publisher-returns: true
    listener:
      simple:
        acknowledge-mode: manual
        prefetch: 20
        default-requeue-rejected: false
```

声明交换机、队列和绑定：

```java
@Configuration
public class RabbitConfig {

    @Bean
    public DirectExchange orderExchange() {
        return ExchangeBuilder.directExchange("order.exchange").durable(true).build();
    }

    @Bean
    public Queue orderQueue() {
        return QueueBuilder.durable("order.queue")
            .withArgument("x-queue-type", "quorum")
            .deadLetterExchange("order.dlx")
            .deadLetterRoutingKey("order.dead")
            .build();
    }

    @Bean
    public Binding orderBinding(Queue orderQueue, DirectExchange orderExchange) {
        return BindingBuilder.bind(orderQueue).to(orderExchange).with("order.created");
    }
}
```

消费者手动确认：

```java
@RabbitListener(queues = "order.queue")
public void onOrderCreated(
        OrderMessage message,
        Channel channel,
        @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) throws IOException {
    try {
        orderService.handle(message); // 内部保证幂等，事务提交后再返回
        channel.basicAck(deliveryTag, false);
    } catch (RetryableException ex) {
        // 交给重试队列或死信，避免原地 requeue 死循环
        channel.basicNack(deliveryTag, false, false);
    } catch (Exception ex) {
        channel.basicNack(deliveryTag, false, false);
    }
}
```

几个容易混淆的点：

- Spring 的 `acknowledge-mode: auto` 不是 RabbitMQ 的自动 ACK，它表示「监听方法正常返回后由容器 ACK」；抛异常时是否重入由 `defaultRequeueRejected` 和错误处理器决定。
- 手动 ACK 模式下，监听方法抛异常但没显式 ACK/NACK，消息可能一直处于 unacked，直到 channel 关闭。
- `default-requeue-rejected: false` 会把被拒绝的消息交给 DLX；如果没有配置 DLX，消息会被丢弃，不会自动进死信。
- 序列化建议用 JSON converter，并限制反序列化的类型来源，避免不受信任的类型头带来安全风险。

## 运维与排查

管理台先看四组数：

- **connections / channels**：是否频繁建立连接、channel 是否泄漏。
- **queues**：ready、unacked、consumers、消息进出速率。
- **exchanges / bindings**：消息有没有绑定到目标队列。
- **DLQ / 重试队列**：是否有积压和持续增长。

常用命令：

```bash
rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
rabbitmqctl list_connections name state channels
rabbitmqctl list_exchanges name type
rabbitmqctl status
```

常见现象：

| 现象 | 先查什么 |
|---|---|
| 队列持续积压 | 消费者是否存活、消费耗时、prefetch、下游依赖、消费线程数 |
| unacked 很高 | 消费者卡住、业务阻塞、忘记 ACK、prefetch 过大 |
| 消息反复重投 | 异常未处理、`requeue=true`、ACK 模式、消费者超时 |
| 生产者被阻塞 | 内存/磁盘告警、连接被 blocked、队列积压 |
| 消息丢失 | 无绑定、未开 mandatory、自动 ACK、队列/消息未持久化、未开 confirm |
| 消息重复 | 至少一次投递、网络重试、消费者重投；补幂等 |
| 顺序错乱 | 多消费者并发、重投、重试队列；用单活跃消费者或分区 |
| 连接/channel 过多 | 每条消息新建连接、channel 未复用或未关闭 |

排查顺序：先确认消息有没有到交换机、有没有绑定到队列，再看队列的 ready/unacked/consumers，最后看消费者日志和下游状态。不要一上来就重启 Broker。

## 常见答疑

**1. Exchange 和 Queue 有什么区别？生产者能直接发给队列吗？**

Exchange 负责路由，不存消息；Queue 才存消息。默认交换机允许 routing key 直接写队列名，但显式声明 exchange 和 binding 更清晰，也方便后续扩展多个消费者。

**2. durable 队列就代表消息不会丢吗？**

不代表。durable 只保证队列元数据在重启后还在；消息本身要设置持久化（delivery mode 2），交换机也要 durable，并且开启发布确认，才能覆盖「Broker 收到并落盘」这一段。

**3. 发布确认和事务怎么选？**

优先发布确认。事务会显著降低吞吐，而且只解决生产者到 Broker 的确认问题；confirm 可以异步、批量处理，更适合生产环境。两者都不能替代消费者端的 ACK 和幂等。

**4. mandatory 和 returns 是做什么的？**

`mandatory=true` 时，消息无法路由到任何队列会返回给生产者；配合 `ReturnsCallback` 可以记录并补偿。不开 mandatory 时，无法路由的消息可能被静默丢弃。

**5. 自动 ACK 为什么危险？**

消费者一拿到消息就认为成功，业务代码崩溃、进程被杀或数据库回滚时消息已经没了。业务消息应使用手动 ACK，等业务事务提交后再确认。

**6. Spring 的 AUTO ACK 和 RabbitMQ 的自动 ACK 是一回事吗？**

不是。Spring 的 `AcknowledgeMode.AUTO` 是监听方法正常返回后由容器发送 ACK；RabbitMQ 的 no-ack 是消费到消息就确认。前者仍会在异常时走容器的重试/拒绝逻辑。

**7. prefetch 设多少合适？**

取决于单条消息处理时间和下游容量。太大容易一次拉满内存、负载不均；太小会让消费者空闲。先从较小值开始，结合消费耗时、unacked 数量和下游承受能力压测调整。

**8. 消费失败后应该 requeue 吗？**

只有确认是短暂故障且能快速恢复时才考虑重新入队，并且要有次数限制。无限 `requeue=true` 会造成毒消息循环；更常见的是进入重试队列或 DLX，记录失败原因后人工处理。

**9. 死信队列什么时候触发？**

常见三种：消费者 reject/nack 且 requeue=false；消息 TTL 到期；队列超过最大长度。队列自身的空闲过期（`x-expires`）会删除整个队列，不属于死信。配置后要实际验证触发条件和路由结果。

**10. RabbitMQ 能保证消息顺序吗？**

只能保证单队列的基本投递顺序。多个消费者并发、失败重投、重试队列都会打乱顺序。严格顺序需要单活跃消费者、按业务键路由到固定队列，或改用支持分区的流平台。

**11. 消息重复怎么办？**

接受至少一次投递，消费端做幂等：业务唯一键、去重表、Redis 标记、状态机条件更新都可以。不要依赖 Broker 帮你做到端到端恰好一次。

**12. 延迟消息怎么实现？**

常见做法是「TTL + 死信交换机」：消息先进入带 TTL 的队列，过期后转入业务队列。也可以评估延迟消息插件，但它不是核心默认能力，队列类型和版本兼容性要先确认。

**13. RabbitMQ 和 Kafka 怎么选？**

需要灵活路由、低延迟、逐条确认和任务队列，选 RabbitMQ；需要高吞吐、日志回放、分区顺序和流处理，选 Kafka。两者也可以同时存在，按业务边界拆。

**14. 集群是不是每个节点都有一份消息？**

不是。经典队列通常只在一个节点上，quorum queue 才做副本复制；客户端可以连任意节点，但队列的实际位置由队列类型和策略决定。高可用要选 quorum queue 并验证故障切换。

**15. 大消息可以直接塞进 MQ 吗？**

不建议。大消息会占内存、磁盘和网络，拖慢整个 Broker。把文件放对象存储，消息里只传引用和校验信息，并设置合理的消息大小上限。

**16. Connection 和 Channel 怎么复用？**

Connection 复用，Channel 按线程或任务使用，不要多线程共享一个 Channel。发布消息时避免每条消息新建连接；Spring AMQP 已经帮你管理连接和 channel 池，但自定义代码要注意关闭。

## 小结

RabbitMQ 的可靠性不是一个开关，而是三段共同成立：

- 生产者：confirm + mandatory/returns + 持久化 + Outbox。
- Broker：durable、quorum queue、集群、磁盘/内存告警和监控。
- 消费者：手动 ACK、幂等、prefetch、重试与死信、顺序约束。

把「消息有没有到、有没有路由、有没有落盘、业务有没有成功、失败后去哪」这五个问题逐段确认，大部分「消息丢了/重复了/堆积了」都能定位。端到端不追求 exactly-once，设计成至少一次投递加幂等消费，系统会简单很多。

## 参考

- [RabbitMQ 官方文档](https://www.rabbitmq.com/docs)
- [可靠性指南](https://www.rabbitmq.com/docs/reliability)
- [发布确认](https://www.rabbitmq.com/docs/confirms)
- [消费者预取与确认](https://www.rabbitmq.com/docs/consumers)
- [Quorum Queues](https://www.rabbitmq.com/docs/quorum-queues)
- [Dead Lettering](https://www.rabbitmq.com/docs/dlx)
---
title: "Java 并发学习记录：线程、锁、线程池与常见疑惑"
slug: "java-concurrency-learning"
date: "2026-10-27"
updated: "2026-10-27"
category: notes
tags: [java, concurrency, threads, locks, thread-pool, jmm]
prompts: []
summary: "把 Java 并发拆成三件事：原子性、可见性、有序性。围绕线程状态、JMM、synchronized / ReentrantLock、CAS、ThreadLocal、线程池和并发工具整理一遍，最后列出 16 个实际写代码时最容易混淆的问题。"
---

Java 并发难，不是 API 太多，而是同一个问题可以从很多层解释：线程调度层、JVM 内存模型、锁实现、线程池配置、业务幂等。只背「synchronized 是重量级锁」「线程池核心线程数设为 CPU+1」这种结论，换一个场景就不成立了。

这篇是我自己的并发知识地图：先抓住三个核心问题，再按线程、内存模型、锁、线程池、并发工具的顺序展开，最后集中回答实际写代码时最容易卡住的疑惑。

## 先抓住三个问题

并发 bug 基本都落在三件事上：

- **原子性**：一个操作要么全部完成，要么全部不生效。`i++` 看起来是一条语句，实际上包含读、加、写三步。
- **可见性**：一个线程改了共享变量，另一个线程能不能及时看到。CPU 缓存、编译器优化都会影响。
- **有序性**：代码实际执行顺序可能和写的顺序不同。单线程下重排不影响结果，多线程下会。

`volatile` 解决可见性和有序性，不解决原子性；`synchronized` 和 `ReentrantLock` 三者都能保证；`CAS` 解决原子性，配合 `volatile` 才能同时保证可见性。

## 线程基础

### 创建线程不是重点，怎么管才是

```java
// 不推荐在业务代码里直接 new Thread
new Thread(() -> doWork()).start();

// 推荐：显式线程池
ExecutorService pool = new ThreadPoolExecutor(
    4, 8, 60, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(200),
    new ThreadFactory() {
        private int index = 0;
        @Override
        public Thread newThread(Runnable r) {
            return new Thread(r, "order-worker-" + (++index));
        }
    },
    new ThreadPoolExecutor.CallerRunsPolicy()
);
```

`Runnable` 没有返回值，`Callable` 配合 `Future` 可以拿结果和异常。`Future.get()` 会阻塞，必须设超时；批量任务用 `CompletableFuture` 或 `invokeAll`，不要在一个循环里逐个 `get()` 把并行又变回串行。

### 六种状态

| 状态 | 含义 | 常见入口 |
|---|---|---|
| `NEW` | 创建了但还没 `start()` | `new Thread()` |
| `RUNNABLE` | 可运行，可能在等 CPU 或正在跑 | `start()` 之后 |
| `BLOCKED` | 等 `synchronized` 监视器锁 | 进入同步块失败 |
| `WAITING` | 无限等待，需要别人唤醒 | `wait()`、`join()`、`park()` |
| `TIMED_WAITING` | 有时限的等待 | `sleep()`、`wait(timeout)`、`join(timeout)` |
| `TERMINATED` | 已结束 | `run()` 正常返回或抛异常 |

`BLOCKED` 和 `WAITING` 经常被混为一谈：前者是在等锁，后者是在等条件或信号。

### 中断是协作式的

`interrupt()` 不是强行杀线程，只是设置中断标志。阻塞在 `sleep`、`wait`、`join`、`take` 等方法上的线程会抛 `InterruptedException`，同时清除中断标志。

```java
try {
    while (!Thread.currentThread().isInterrupted()) {
        Task task = queue.take();
        handle(task);
    }
} catch (InterruptedException e) {
    Thread.currentThread().interrupt(); // 恢复标志，交给上层决定
} finally {
    cleanup();
}
```

捕获 `InterruptedException` 后直接吞掉，是线程池里任务无法正常停止的常见原因。`stop()`、`suspend()` 已经废弃，不要用。

## JMM 与 happens-before

Java 内存模型是抽象概念，不是「堆和栈」的同义词。它规定线程之间通过主内存通信，每个线程有自己的工作内存；如果没有同步，一个线程的写入不保证另一个线程能看到。

`happens-before` 是判断可见性的规则，常用的几条：

- 同一个线程内，前面的操作 happens-before 后面的操作。
- 对同一个锁的解锁 happens-before 后续的加锁。
- 对 `volatile` 变量的写 happens-before 后续的读。
- `Thread.start()` happens-before 新线程里的动作。
- 线程中的所有操作 happens-before 其他线程从 `join()` 返回。
- 规则可以传递。

### DCL 单例为什么要加 volatile

```java
public class Singleton {
    private static volatile Singleton instance;

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

`new Singleton()` 不是原子操作，可能被重排成：分配内存 → 把引用指向内存 → 初始化对象。另一个线程可能在引用非空、对象还没初始化完时读到它。`volatile` 禁止这种重排，同时保证可见性。

## 锁与同步

### synchronized

`synchronized` 修饰实例方法锁当前对象，修饰静态方法锁 `Class` 对象，修饰代码块锁括号里的对象。锁是可重入的，同一个线程重复进入不会死锁。

要避开的坑：

- 不要锁 `String`、`Integer` 等常量或缓存对象，其他地方可能也在锁同一个对象。
- 锁对象引用不要被重新赋值，否则锁的不是同一个东西。
- 锁范围尽量小，但也不能小到把需要原子的步骤拆开。
- 新版本 JVM 默认关闭偏向锁，面试里的「锁升级」要结合版本看，实际排错更该关注锁持有时间和竞争程度。

### wait / notify

```java
synchronized (lock) {
    while (!condition) {
        lock.wait();
    }
    // 条件满足后继续
}
```

`wait()` 必须在 `synchronized` 块里调用，否则抛 `IllegalMonitorStateException`；它会释放锁并进入等待，`notify()` / `notifyAll()` 唤醒后再重新竞争锁。

用 `while` 而不是 `if`，因为存在虚假唤醒和「被唤醒后条件又被别人改回去」的情况。多个等待条件时优先 `notifyAll()`，除非能确认 `notify()` 唤醒的正是需要的那一个。

### ReentrantLock

比 `synchronized` 多了可中断、超时、公平锁和多个条件变量：

```java
private final ReentrantLock lock = new ReentrantLock();
private final Condition notEmpty = lock.newCondition();

public void put(Task task) throws InterruptedException {
    lock.lockInterruptibly();
    try {
        while (queue.size() == capacity) {
            notEmpty.await();
        }
        queue.add(task);
    } finally {
        lock.unlock();
    }
}
```

`unlock()` 必须放 `finally`。公平锁能减少饥饿，但吞吐通常更低；大部分场景用非公平锁。

### 读写锁与 StampedLock

`ReentrantReadWriteLock` 适合读多写少：读锁共享，写锁独占。但读锁长期占用时会阻塞写锁，非公平模式下写线程可能饥饿。

`StampedLock` 提供乐观读，读多写少且读操作很短时性能更好；它不可重入，也不支持条件变量，用法更复杂，别默认替换所有读写锁。

### 底层：AQS

`ReentrantLock`、`Semaphore`、`CountDownLatch` 等很多同步器都基于 AQS。核心是：

- 一个 `volatile int state` 表示同步状态。
- CAS 修改 state。
- 竞争失败的线程进入一个 FIFO 等待队列，被前驱节点唤醒。

不需要背源码，但要理解：AQS 管的是「排队 + 阻塞 + 唤醒」，具体 state 的含义由子类决定。`ReentrantLock` 的 state 是重入次数，`Semaphore` 的 state 是可用许可数。

## volatile、CAS 与原子类

`volatile` 保证可见性和有序性，不保证原子性：

```java
private volatile int count = 0;

public void increment() {
    count++; // 不是原子操作，并发下仍会丢更新
}
```

计数用 `AtomicInteger`、`AtomicLong`；高并发累加用 `LongAdder`，它把热点拆到多个 Cell 上，最后再汇总，代价是 `sum()` 不是强一致快照。

CAS 是「比较并交换」，靠 CPU 指令保证原子性。它有三个问题：

- **ABA**：值从 A 改成 B 又改回 A，CAS 看不出来。需要版本号时用 `AtomicStampedReference`。
- **自旋开销**：竞争激烈时一直重试会浪费 CPU。
- **只能保证一个变量**：多个变量要么合并成一个对象用 `AtomicReference`，要么加锁。

## ThreadLocal

`ThreadLocal` 给每个线程一份独立副本，适合放请求上下文、用户信息、数据库路由标记这类「线程内共享、线程间隔离」的数据。

```java
private static final ThreadLocal<UserContext> CONTEXT = new ThreadLocal<>();

try {
    CONTEXT.set(userContext);
    doBusiness();
} finally {
    CONTEXT.remove();
}
```

内存泄漏的原因：`ThreadLocalMap` 的 key 是弱引用，value 是强引用。ThreadLocal 对象被回收后 key 变成 null，但 value 还被线程持有；线程池里的线程长期存活，这些 value 就越积越多。所以必须 `remove()`，尤其是在线程池场景。

`InheritableThreadLocal` 只在创建子线程时复制一次，线程池复用线程时不会按任务重新传递。需要跨线程池传递上下文时，用 TransmittableThreadLocal 或显式传参，别指望它自动生效。

## 线程池

### 七个参数和执行顺序

```java
new ThreadPoolExecutor(
    corePoolSize,      // 核心线程数
    maximumPoolSize,   // 最大线程数
    keepAliveTime,     // 非核心线程空闲存活时间
    unit,
    workQueue,         // 任务队列
    threadFactory,     // 线程命名、异常处理
    handler            // 拒绝策略
);
```

提交任务的顺序：

1. 当前线程数小于核心数：创建核心线程执行。
2. 核心线程已满：任务进入队列。
3. 队列已满且线程数小于最大数：创建非核心线程。
4. 队列和最大线程都满了：执行拒绝策略。

核心线程默认不会被回收（除非 `allowCoreThreadTimeOut(true)`）；线程也不是在构造线程池时创建，而是提交任务时按需创建，可以 `prestartCoreThread()` 预热。

### 队列与拒绝策略

| 队列 | 特点 |
|---|---|
| `ArrayBlockingQueue` | 有界数组队列，最常用，内存可控 |
| `LinkedBlockingQueue` | 默认无界（`Integer.MAX_VALUE`），容易堆积 |
| `SynchronousQueue` | 不存储任务，直接交给线程，适合高吞吐短任务 |
| `PriorityBlockingQueue` | 按优先级出队，无界 |
| `DelayQueue` | 延时任务，元素实现 `Delayed` |

拒绝策略：`AbortPolicy` 抛异常、`CallerRunsPolicy` 让提交线程自己跑、`DiscardPolicy` 静默丢弃、`DiscardOldestPolicy` 丢最老的。业务上通常需要自定义策略，记录日志、降级或转异步补偿，不能静默丢任务。

### 为什么不建议用 Executors

- `FixedThreadPool` 和 `SingleThreadExecutor` 使用无界 `LinkedBlockingQueue`，任务堆积会 OOM。
- `CachedThreadPool` 最大线程数是 `Integer.MAX_VALUE`，高并发下可能创建海量线程。
- `ScheduledThreadPool` 的队列也无界。

不是说这些工厂方法绝对不能用，而是它们隐藏了队列和最大线程数，线上出问题时很难定位。显式 `new ThreadPoolExecutor`，至少能看清边界。

### 线程数怎么定

CPU 密集型任务，经验值是核数 + 1；IO 密集型任务可以更高，常见公式是：

```text
线程数 = CPU 核数 × 目标利用率 × (1 + 等待时间 / 计算时间)
```

但这只是起点。真实值取决于下游数据库、Redis、HTTP 接口的容量，以及任务是否会阻塞。线程太多会把压力转给下游，线程太少又会让 CPU 闲置。最终以压测和监控为准，至少看活跃线程数、队列长度、任务耗时和拒绝次数。

### 关闭与监控

`shutdown()` 不再接受新任务，已提交的任务继续执行；`shutdownNow()` 尝试中断正在执行的任务并返回队列中的任务。关闭后要 `awaitTermination` 等一段时间，避免进程退出时任务被截断。

监控至少包括：活跃线程数、池大小、队列长度、完成任务数、拒绝次数、任务执行时间。Spring 的 `@Async` 要显式配置专用线程池，不要依赖默认执行器；不同业务最好隔离线程池，避免一个慢接口拖垮所有异步任务。

### 虚拟线程

Java 21 的虚拟线程由 JVM 调度，创建成本低，适合大量 IO 阻塞任务。但它不是万能加速器：

- 不要池化虚拟线程，按任务创建即可。
- 它不能提升下游容量，数据库连接池、HTTP 连接数仍然要限。
- 阻塞在 native 调用或 `synchronized` 上时，可能占住载体线程；早期版本这个问题更明显。
- 需要限制并发时用 `Semaphore`，而不是靠线程池大小。

CPU 密集型任务仍然适合固定大小的平台线程池。

## 并发工具

### CountDownLatch / CyclicBarrier / Semaphore

| 工具 | 作用 | 特点 |
|---|---|---|
| `CountDownLatch` | 等 N 个任务完成 | 一次性，计数到 0 不能重置 |
| `CyclicBarrier` | N 个线程互相等待到齐 | 可复用，适合分阶段任务 |
| `Semaphore` | 控制同时访问的线程数 | 可公平/非公平，适合限流和资源池 |
| `Exchanger` | 两个线程交换数据 | 使用场景较少 |

### CompletableFuture

```java
CompletableFuture<User> userFuture =
    CompletableFuture.supplyAsync(() -> loadUser(id), executor);

CompletableFuture<Order> orderFuture =
    CompletableFuture.supplyAsync(() -> loadOrder(id), executor);

CompletableFuture<Summary> result = userFuture
    .thenCombine(orderFuture, Summary::new)
    .exceptionally(ex -> Summary.empty());
```

默认的 `supplyAsync` 使用 `ForkJoinPool.commonPool()`，阻塞型任务会占满公共池，影响同 JVM 的其他并行流和异步任务。业务代码要传自己的线程池。

`allOf` 只负责等全部任务结束，不会因为一个失败就自动取消其余任务；每个任务的结果和异常要单独处理，最后 `join()` 时再统一决定成功还是失败。`get()` 要设超时，避免请求线程被无限挂起。

### ConcurrentHashMap

JDK 8 之后是 CAS + 桶头节点 `synchronized`，锁粒度到单个桶，读操作基本无锁。它不允许 null key / null value，`size()` 在高并发下是估算值。

复合操作要用原子 API：

```java
map.computeIfAbsent(key, k -> new Counter()).increment();
map.merge(key, 1, Integer::sum);
```

先 `containsKey` 再 `put` 仍然有竞态。需要同时原子更新多个 key 时，`ConcurrentHashMap` 本身不提供跨 key 事务，还是要靠锁或重新设计。

### 其他容器

- `CopyOnWriteArrayList`：写时复制，适合读多写少、元素少的监听器列表；频繁写会不断复制数组。
- `BlockingQueue`：生产者-消费者模型的基础，`put` / `take` 阻塞，`offer` / `poll` 可带超时。
- `Collections.synchronizedMap`：每个方法加锁，遍历时仍需要手动同步整个 map。

## 常见疑惑

**1. synchronized 和 ReentrantLock 怎么选？**

优先 `synchronized`：语法简单、自动释放、JVM 持续优化。需要可中断、超时、公平锁、多个条件变量，或者要把锁和业务状态解耦时，用 `ReentrantLock`。不要因为「ReentrantLock 性能更好」就无脑替换，竞争不激烈时差别很小。

**2. volatile 能保证 i++ 的原子性吗？**

不能。`i++` 是读、加、写三步，`volatile` 只保证每次读到最新值，两个线程仍可能同时读到旧值。用 `AtomicInteger`、`LongAdder` 或加锁。

**3. 双重检查锁为什么必须加 volatile？**

防止「引用先可见、对象还没初始化完」的重排，同时保证一个线程初始化后的结果对另一个线程可见。

**4. 核心线程会一直存活吗？**

默认会，即使空闲也不回收。`allowCoreThreadTimeOut(true)` 可以让核心线程也按 `keepAliveTime` 回收；线程池刚创建时并没有线程，提交任务才创建。

**5. 为什么队列满了才会创建到最大线程数？**

这是 `ThreadPoolExecutor` 的设计：先尽量复用核心线程，再排队，队列满后才扩容。所以用无界队列时，`maximumPoolSize` 永远不会生效，任务会一直堆到 OOM。

**6. 线程数到底设多少？**

先按 CPU / IO 比例估一个范围，再用压测验证。还要看下游能承受多少并发、任务是否阻塞、是否需要隔离。不要照抄「CPU 核数 + 1」然后所有池都这么配。

**7. 为什么阿里规约禁止用 Executors 创建线程池？**

主要针对 `FixedThreadPool`、`SingleThreadExecutor` 的无界队列和 `CachedThreadPool` 的无界线程数，任务突增时容易 OOM 或线程爆炸。显式构造线程池，边界才看得见。

**8. ThreadLocal 为什么会内存泄漏？**

`ThreadLocalMap` 的 key 是弱引用，value 是强引用；线程池线程长期存活，key 被回收后 value 仍可能留着。用完必须 `remove()`，不要依赖弱引用自动清理。

**9. wait 为什么必须在 synchronized 里？**

因为 `wait` 要释放对象监视器并进入等待队列，不在同步块里没有锁可释放，会抛 `IllegalMonitorStateException`。用 `while` 包住等待条件，防止虚假唤醒。

**10. sleep 和 wait 有什么区别？**

`sleep` 是 `Thread` 的静态方法，不释放锁；`wait` 是 `Object` 的方法，释放锁并等待通知。两者都能被中断，但语义完全不同。

**11. BLOCKED 和 WAITING 有什么区别？**

`BLOCKED` 是在等 `synchronized` 锁；`WAITING` 是调用了 `wait`、`join`、`park` 等进入无限等待，需要其他线程唤醒或事件发生。`TIMED_WAITING` 则是带超时的等待。

**12. AQS 到底是什么？**

一个用来构建锁和同步器的框架：`volatile state` 表示状态，CAS 修改状态，FIFO 队列管理等待线程。`ReentrantLock`、`Semaphore`、`CountDownLatch` 都基于它，但 state 的含义各不相同。

**13. 死锁怎么排查和避免？**

用 `jstack` 或 Arthas 的 `thread` 命令看线程栈和锁持有关系，JVM 通常能直接标出死锁。避免方式：固定加锁顺序、缩小锁范围、用 `tryLock(timeout)`、避免嵌套锁、不要持有锁调用外部服务。

**14. CompletableFuture 有哪些坑？**

默认用公共 `ForkJoinPool`，阻塞任务会拖垮其他异步任务；不传线程池就没有业务隔离；`allOf` 不会自动取消其他任务；`get()` 不设超时可能永久阻塞；异常不处理会被吞掉。

**15. 虚拟线程能替代线程池吗？**

不能完全替代。它适合大量 IO 阻塞任务，能降低线程创建和上下文切换成本；但下游连接池、限流和 CPU 核数仍然是瓶颈。CPU 密集型任务还是用固定大小的平台线程池。

**16. 并发容器能完全替代锁吗？**

不能。`ConcurrentHashMap` 只保证单个操作的原子性，跨 key 的「先检查再更新」仍需 `compute` / `merge` 或外部锁。并发容器解决的是容器自身的线程安全，不是业务组合操作的原子性。

## 小结

并发问题的分析顺序可以是：

1. 有没有共享可变状态？能不能改成不可变、线程封闭或消息传递？
2. 需要保护的是原子性、可见性还是有序性？
3. 用 `volatile`、原子类、锁还是并发容器？锁的范围是否覆盖了完整的业务步骤？
4. 线程池的队列、最大线程数、拒绝策略和下游容量是否匹配？
5. 出问题时能否从线程栈、监控和日志还原现场？

把这三性和工具对应起来，比背锁的八股文更有用。真正上线前，线程池参数、锁粒度和超时都要用压测和故障演练验证，而不是只看代码「看起来没问题」。

## 参考

- [Java SE 并发教程](https://docs.oracle.com/javase/tutorial/essential/concurrency/)
- [java.util.concurrent 包文档](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/package-summary.html)
- [ThreadPoolExecutor API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html)
- [JEP 444: Virtual Threads](https://openjdk.org/jeps/444)
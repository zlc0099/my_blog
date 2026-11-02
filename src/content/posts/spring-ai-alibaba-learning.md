---
title: "Spring AI Alibaba 学习记录：分层结构、Graph 编排与常见答疑"
slug: "spring-ai-alibaba-learning"
date: "2026-11-02"
updated: "2026-11-02"
category: notes
tags: [spring-ai-alibaba, spring-ai, dashscope, graph, agent, rag]
prompts: []
summary: "把 Spring AI Alibaba 拆成三层来看：Spring AI 的模型抽象、Graph Core 的图编排、Agent Framework 的智能体组合。理清它和 Spring AI 的分工、版本怎么对齐、Graph 和 BPMN 工作流引擎的边界在哪里，最后整理接入通义、做 RAG 和 Agent 时最容易卡住的 12 个疑问。"
---

在 Java 里接大模型，一开始都是手写 HTTP：拼请求、解析响应、处理流式分片、把多轮对话自己存在内存里、工具调用的 JSON 自己解析。能跑，但每一块都要重复造。Spring AI 把这些收敛成统一抽象，Spring AI Alibaba（下面简称 SAA）则是在这套抽象之上做的阿里云实现和加强。

这篇笔记要解决三个我一直没想清楚的问题：它和 Spring AI 到底怎么分工、Graph 这个模块和后端已有的工作流引擎是不是一回事、以及真要把 AI 能力放进业务系统时从哪一层开始动手。

## 先定位：SAA 不是 Spring AI 的替代品

关系是叠加，不是二选一：

- **Spring AI** 定标准和抽象：`ChatModel` / `ChatClient`、`Prompt` 与 `Message`、`EmbeddingModel`、`VectorStore`、工具调用、MCP、Advisor 链、结构化输出。换模型厂商时业务代码不动。
- **Spring AI Alibaba** 提供这些抽象针对通义系模型（DashScope）的实现，另外补了两块 Spring AI 本身没有的东西：**Graph Core**（状态图执行引擎）和 **Agent Framework**（把 ReAct、多智能体组合做成现成组件）。

所以判断要不要用它，可以按这个粗线划分：只调一个对话接口，Spring AI + 任一模型 starter 就够；需要通义特有的能力（qwen-vl 多模态、重排模型、联网搜索参数），或者需要多步骤编排和智能体，SAA 的价值才体现出来。

## 三层结构

官方文档把它分成三层，我觉得这个分层比记类名有用：

1. **Augmented LLM 原语**——模型、消息、工具与 MCP、向量存储、结构化输出。一次请求内的能力。
2. **Graph Core**——节点、边、条件边、共享状态、检查点。多次步骤之间的能力。
3. **Agent Framework**——`ReactAgent` 和几种多智能体组合。把「下一步做什么」交给模型决定的能力。

上层依赖下层：Agent Framework 本身就是用 Graph Core 的运行时拼出来的。周边还有 JManus、Studio 调试界面、Admin 这类工具，我目前只停在知道有这些东西的阶段，没有深入用。

## 版本必须成对

SAA 的更新很密集，版本错配比写错代码更常见。按官方对照表选：

| SAA | Spring AI | Spring Boot | 备注 |
| --- | --- | --- | --- |
| 1.1.2.0 | 1.1.2 | 3.5.x | 当前推荐，支持 Agent Skills 与多智能体路由 |
| 1.1.0.0 | 1.1.0 | 3.4.x | 1.1 线首个稳定版 |
| 1.0.x | 1.0.0 | 3.4.x | 旧分支，网上多数教程停在这里 |

依赖统一用 BOM 管理，不要单独钉某个模块的小版本：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.alibaba.cloud.ai</groupId>
      <artifactId>spring-ai-alibaba-bom</artifactId>
      <version>1.1.2.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.ai</groupId>
      <artifactId>spring-ai-bom</artifactId>
      <version>1.1.2</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

有一个改名坑值得单独说：1.0 时代的起步依赖叫 `spring-ai-alibaba-starter`，到 1.1 拆成了 `spring-ai-alibaba-starter-dashscope`；Graph 和 Agent 分别在 `spring-ai-alibaba-graph-core` 和 `spring-ai-alibaba-agent-framework`。照着旧教程抄坐标，会在依赖解析或者自动装配上失败，而且报错信息不会直接告诉你「名字变了」。

## 最小可用：把模型接进来

```yaml
spring:
  ai:
    dashscope:
      api-key: ${AI_DASHSCOPE_API_KEY}
      chat:
        options:
          model: qwen-plus
          temperature: 0.7
```

调用走 `ChatClient`，它是 Spring AI 提供的流畅 API，`ChatModel` 是它底下的抽象：

```java
@RestController
@RequestMapping("/ai")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String q) {
        return chatClient.prompt()
                .user(q)
                .call()
                .content();
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> stream(@RequestParam String q) {
        return chatClient.prompt().user(q).stream().content();
    }

    @GetMapping("/extract")
    public Summary extract(@RequestParam String text) {
        return chatClient.prompt()
                .user("把下面内容提炼成要点：" + text)
                .call()
                .entity(Summary.class);   // 结构化输出
    }
}
```

三个细节：

- Key 用环境变量而不是硬编码写进配置文件，配置中心里也一样不要明文存。
- `.entity(Xxx.class)` 让框架负责生成 JSON schema 约束、解析和校验，比让模型「输出 JSON」再自己 `parse` 可靠得多。
- `stream()` 返回 `Flux`。传统 Servlet MVC 也能用（Spring 提供了适配），但要注意网关和 Nginx 的响应缓冲会把流式效果吃掉，必须关掉缓冲。

## ChatClient 之外每天要用的三件事

**1. Advisor 链。** Spring AI 把「请求前后做点什么」抽象成 Advisor：日志、安全、记忆、检索都是它。`ChatClient.Builder.defaultAdvisors(...)` 一次配置，全链生效。这个设计对后端很友好，跟拦截器是一个思路。

**2. 会话记忆。** `MessageWindowChatMemory` 按窗口保留最近若干条消息，底层可以接 JDBC / Redis / MongoDB 存储。要点：

- 内存版重启即丢，生产要接持久化仓储。
- 会话 id 的传递方式在 1.0 和 1.1 之间有过调整，从旧教程抄的那段代码很可能已经不能直接编译，以当前小版本的 API 为准。
- 记忆是「把历史塞回上下文」，不是真的让模型记住你。窗口长度直接决定 token 成本。

**3. 工具调用。** 用 `@Tool` 标注方法，把入参出参做成简单 DTO，注册后模型可以自己决定调哪个：

```java
@Service
public class OrderTools {

    @Tool(description = "按订单号查询订单的当前状态和金额")
    public OrderView orderStatus(@ToolParam(description = "订单号") String orderNo) {
        return orderService.view(orderNo);
    }
}
```

框架会完成「模型返回 tool call → 反射执行 → 结果二次发送 → 拿最终答案」的循环，这就是 Agent 的雏形。写工具时真正的难点不在注解，在描述文本——`description` 是给模型看的 prompt，写模糊了它就调不对；还要注意幂等、超时，以及有风险的操作必须留人工确认。

MCP 可以理解为工具调用标准化后的协议层：`spring-ai-starter-mcp-client` 把外部 MCP server 暴露的工具直接接入，不用自己一个个写 `@Tool`。

## RAG 这条路

流程固定成六步：读取文档 → 解析 → 切分 → 向量化 → 存进 `VectorStore` → 检索结果拼进 prompt 再生成。

```java
chatClient.prompt()
    .advisors(new QuestionAnswerAdvisor(vectorStore, SearchRequest.builder().topK(5).build()))
    .user(question)
    .call()
    .content();
```

我记的几个中文场景要点：

- **切分按结构和语义**，不要按固定字数硬切。带标题层级的文档，切片时把所属标题一起塞进去，否则检索到的片段没有上下文。
- **embedding 模型和维度必须和索引一致**。换模型等于重建整个库，这件事要提前想清楚。
- **召回后加 rerank**。topK 取 20，用重排模型留 5，通常比直接取 top5 效果好，通义这条链路上有对应的能力。
- **要有一小套评测集**。改 prompt、换模型、调 topK 之后凭感觉判断是好是坏，是不可靠的；哪怕只有二十个问题，也比没有强。

## Graph Core：这块才是 SAA 独有的重点

概念只有四个，理解成「一块共享黑板 + 若干动作 + 动作之间的走法」：

- **State**：`OverAllState`，各节点读写的工作区。每个 key 要有更新策略，`ReplaceStrategy` 覆盖，`AppendStrategy` 追加。
- **Node**：实现 `NodeAction` 的 `apply(OverAllState)`，返回一个 `Map` 表示本步产生的状态更新。
- **Edge**：`addEdge(a, b)` 固定跳转；`addConditionalEdges(...)` 根据状态值决定走哪个分支。
- **编译执行**：`StateGraph` 编译成 `CompiledGraph`，用 `invoke` 或 `stream` 运行。

```java
import static com.alibaba.cloud.ai.graph.StateGraph.END;
import static com.alibaba.cloud.ai.graph.StateGraph.START;

StateGraph graph = new StateGraph(() -> Map.<String, KeyStrategy>of(
        "input", new ReplaceStrategy(),
        "docs",  new AppendStrategy(),
        "hit",   new ReplaceStrategy()));

graph.addNode("rewrite", AsyncNodeAction.node_async(new RewriteNode()));
graph.addNode("retrieve", AsyncNodeAction.node_async(new RetrieveNode()));
graph.addNode("answer",   AsyncNodeAction.node_async(new AnswerNode()));
graph.addNode("fallback", AsyncNodeAction.node_async(new FallbackNode()));

graph.addEdge(START, "rewrite");
graph.addConditionalEdges("retrieve",
        AsyncEdgeAction.edge_async(s -> Boolean.TRUE.equals(s.value("hit").orElse(false)) ? "answer" : "fallback"),
        Map.of("answer", "answer", "fallback", "fallback"));
graph.addEdge("answer", END);

CompiledGraph app = graph.compile(CompileConfig.builder()
        .saverConfig(SaverConfig.builder().register(new MemorySaver()).build())
        .interruptBefore("answer")        // 人工介入点
        .build());

app.stream(inputs, RunnableConfig.builder().threadId("conv-1").build());
```

`stream` 返回 `Flux<NodeOutput>`，每个元素是「某节点执行完的一次输出」，前端可以据此展示进度，比只给一个最终答案的体验好很多。

**checkpoint 与 human-in-the-loop** 是我最看重的能力。`RunnableConfig` 的 `threadId` 隔离每次会话的执行历史；配上 `MemorySaver` 之类的存储，图会在每个节点后保存状态；`interruptBefore("node")` 让流程停在指定节点，等外部通过 `updateState(...)` 写入人工决策再继续。审批、内容复核、需要人确认再执行操作的场景，靠的就是这一套。

### 和 Flowable / Activiti 是不是一回事

这是我最初最混淆的地方，现在我的结论是：**不是，边界很清楚。**

| | Graph Core | BPMN 引擎（Flowable 等） |
| --- | --- | --- |
| 编排对象 | 一次 AI 任务的推理步骤 | 业务实例的流转 |
| 生命周期 | 秒级到分钟级，一次请求内 | 天级到月级，跨服务跨人员 |
| 状态归属 | 内存/检查点里的 `OverAllState` | 流程定义、任务表、历史表 |
| 人的角色 | 打断点、确认工具动作 | 待办、审批人、委派、超时提醒 |
| 可追溯性 | 面向这次运行的输出 | 面向组织的审计与责任 |

Graph 擅长的是「先改写问题、再检索、再判断要不要调工具、最后生成」这种推理步骤编排；业务审批流该用 BPMN 的还是要用 BPMN，不要拿 Graph 去重建一套待办和审批语义。反过来，把 AI 步骤硬塞进 BPMN 的服务任务里也能跑，但会丢掉流式输出、状态检查和中断恢复这些好处。

## Agent Framework：什么时候才需要它

`ReactAgent` 本质上就是把「模型推理 → 选择工具 → 观察结果 → 再推理」这个循环做成了一张预置图。多智能体组合还有几种形态：`SequentialAgent`（流水线）、`ParallelAgent`（并发后汇总）、`LlmRoutingAgent`（用模型判断该交给哪个子 agent）、`LoopAgent`（迭代直到满足条件）。

我会按这个顺序往上加，而不是反过来：

1. 单轮 prompt 能不能解决；
2. 加 RAG 能不能解决；
3. 加几个工具、让模型自己调能不能解决；
4. 步骤多且分支复杂 → 用 Graph 写明确流程；
5. 步骤本身要由模型决定 → 才上 Agent；
6. 上下文互相污染、职责不同 → 才拆多智能体。

多智能体听起来高级，实际是把一次模型调用变成十几次，成本、延迟和排错难度一起上升。流程能写死就写死，能确定的事情不要交给模型赌。

## 我记住的坑

1. **模型名和额度**。`qwen-plus` / `qwen-max` / `qwen-turbo` / `qwen-vl-max` 价格和上下文长度都不同；限流和额度是运行时最先撞到的墙。
2. **默认超时不够**。生成慢时连接层先超时，要按模型响应时间重新设 HTTP 客户端超时，并配指数退避重试——重试只对幂等请求开。
3. **上下文成本是三项之和**：记忆窗口 + 检索片段 + 工具 schema。只调低其中一项往往看不出效果。
4. **工具调用死循环**。必须有迭代上限和重复调用检测。
5. **不能采信模型自述**。「我已经创建了订单」不算创建了，一切以工具真实返回值和库里的数据为准。
6. **教程过期速度极快**。1.0 的写法到 1.1 有三处以上不兼容（starter 名字、记忆会话参数、部分 API 改名），遇到编译不过先去核对官方文档当前版本，而不是继续搜。
7. **观测**。要留下每次调用的模型、耗时、token 与工具轨迹，否则线上问题无从判断是模型、检索还是业务代码的问题。

## 答疑

**1. 我已经有 Spring AI 了，还需要 SAA 吗？**

看你要不要它的两块增强。纯对话，Spring AI 加任一模型 starter 就够；要用通义特有能力，或者需要 Graph 编排和现成 Agent 组件，才引入 SAA。两者不冲突，SAA 的 DashScope starter 就是 Spring AI 抽象的一个实现。

**2. 能不能用 OpenAI 兼容接口直连通义，省掉这个依赖？**

可以，DashScope 提供兼容模式，OpenAI starter 一样能调。代价是丢掉特有能力（重排、联网搜索参数、部分多模态与函数调用细节），也拿不到 Graph 和 Agent Framework。原型阶段用兼容接口很省事，正式项目要权衡。

**3. Graph 能替代 Flowable 做审批流吗？**

不能，见上面的边界表。Graph 的持久化和中断是围绕一次运行做的，没有组织、待办、审批人、审计这些语义。

**4. Workflow 和 Agent 到底差在哪？**

差在「谁决定下一步」。Workflow（Graph 手写节点和条件边）的路径是你写死的，可预测、便宜、好排错；Agent 的路径由模型决定，灵活但贵且不稳定。同一个需求两种都能做时，先选写死的。

**5. 和 LangChain4j、自研状态机怎么选？**

已经在 Spring 生态里、要用 Spring Security / Boot 3.5 这套自动装配和观测，SAA 更顺；团队更看重社区生态和多厂商平铺，LangChain4j 也是成熟选择。自研状态机只有在流程极简、不想引依赖时才划算，但 checkpoint 和流式这两块要自己补齐，成本容易被低估。

**6. 用 ReactAgent 需要微调模型吗？**

不需要。工具调用能力是模型本身提供的，框架只是把循环编排出来。微调解决的是领域表达和成本，跟能不能跑 Agent 关系不大。

**7. 对话记忆放哪？Redis 合适吗？**

合适，而且是我会优先选的：TTL 天然对应会话过期，读写快，已有集群就能复用。要留意序列化体积——长会话窗口加多模态附件会迅速变大，需要设上限和清理策略。

**8. RAG 效果差，先查什么顺序？**

先看检索而不是生成：拿一批问题打印召回片段，人工判断正确内容有没有被召回。没召回 → 查切分和 embedding；召回了但排在后面 → 加 rerank、调 topK；召回了答案还错 → 查 prompt 里的引用约束和上下文截断。跳过这一步直接改 prompt，多数是白做工。

**9. 换 embedding 模型要注意什么？**

维度、归一化和语义空间都变了，必须重建索引。新旧混用不会报错，只会让相似度计算变得不可解释——这是很难查的一类问题。

**10. 流式输出前端怎么接？**

后端 SSE 或 WebSocket，前端 `EventSource` / fetch 流读取。中间代理要关缓冲、拉长空闲超时、加心跳，否则表现为「卡很久然后一次性出来」。

**11. Studio、JManus 这些周边值得用吗？**

Studio 这类调试界面对快速验证 prompt 和图流程有帮助，能省掉写临时前端的时间。但它是脚手架，不要把调试工具直接放进生产链路。这部分我停留在了解，结论权重别给太高。

**12. 上生产之前最少要准备什么？**

我会列五件：模型与 key 的配置外部化和轮换；超时、限流、重试和降级（模型不可用时业务能退回什么）；token 与费用的监控告警；一套固定评测集用于回归；调用轨迹的日志留存。缺任何一件，AI 功能上线后都无法运维。

## 小结

我现在的理解是：Spring AI 解决「Java 应用怎么跟模型说话」，SAA 在上面补了两件事——通义系的落地实现，以及把「多步骤推理」变成可编程图结构的 Graph Core 与 Agent Framework。

真正需要花时间想清楚的三件事：

- **版本对齐**：BOM 统一，先确认 Boot / Spring AI / SAA 三者成对，再写代码；
- **分层选择**：从 prompt → RAG → 工具 → Graph → Agent 逐层加，能停在低层就停；
- **边界划分**：Graph 编排 AI 步骤，BPMN 编排业务审批，两套语义不要混用。

这篇基于文档阅读和小规模跑通整理，还没有经过大流量生产验证，后面的结论可能会随实际使用改。

## 参考

- [Spring AI Alibaba 官方文档](https://java2ai.com/docs/overview)
- [Spring AI Alibaba 版本说明](https://java2ai.com/docs/versions/)
- [Spring AI Alibaba Graph 快速开始](https://java2ai.com/docs/frameworks/graph-core/quick-start)
- [Spring AI Reference](https://docs.spring.io/spring-ai/reference/)

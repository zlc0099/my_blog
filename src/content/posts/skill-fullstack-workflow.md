---
title: Skill：全栈开发工作流
slug: skill-fullstack-workflow
date: 2026-10-18
updated: 2026-10-18
category: skill
skillType: "self"
repoPath: "myskill/fullstack-dev-workflow"
tags: [skill, fullstack, workflow, testing]
summary: 强制先澄清、再列原子任务、按 TDD 执行，并用真实命令和浏览器结果做验收，而不是口头说完成。
prompts: []
---

## 核心理念

每一次开发任务都必须走流程，禁止"凭直觉直接写代码"。三条铁律：

1. **先问清楚，再动手** —— 需求有歧义时先追问，绝不在模糊状态下产出代码。
2. **先写清单，再写代码** —— 任务开始写工作清单，任务结束更新清单。
3. **先验证，再宣布完成** —— 没有真实命令输出作为证据，不许说"已完成"。

## 何时使用

任何涉及前端 / 后端 / 全栈代码的工作：写新功能、写页面、写接口、改数据库、重构、修 bug、排查报错、加依赖、改构建或部署配置。

**续接场景**：当项目内已存在任务清单或交接文档时，先读取，从上次进度继续，不要从头开始。

## 环境适配 (Environment Adaptation) —— 跨 harness 通用

本 skill 不绑定任何特定 agent 平台。P0 预检时先完成环境探测，其余阶段只引用抽象概念：

**1. 任务目录 (TASK_DIR)** —— 所有过程文档（`CHECKLIST.md` / `DESIGN.md` / `HANDOVER.md`）的落盘根目录，按以下优先级确定：

1. **续接优先**：项目内已存在 `CHECKLIST.md` / `HANDOVER.md`（在 `.agent/task/` 或其他目录）→ 用其所在目录。
2. 项目已有既有约定（如 `.claude/`、`.cursor/` 等目录结构）→ 跟随既有约定。
3. 无任何既有约定：**统一使用中性的 `.agent/task/` 目录**。

探测结果在预检声明中告知用户："任务目录 = XXX"。

**2. 任务跟踪**：环境提供任务管理工具就用之；没有则清单文件本身就是台账（`[ ] / [~] / [x]` 状态流转已足够）。

**3. 长期记忆**：有平台记忆机制（如 memory）就用之；否则用项目内约定文件（`CLAUDE.md` / `AGENTS.md` / 项目笔记），都没有则跳过并提示用户自选落点。

**4. 平台专属字段**：frontmatter 中 `disable` / `disable-model-invocation` 为可选扩展字段，不识别它们的平台会自动忽略，不影响通用性；`name` / `description` 是所有平台的通用契约。

## 流水线总览（7 阶段）

```
P0 触发与预检 → P1 澄清 → P2 设计定稿 → P3 任务清单
→ P4 执行 → P5 独立评审 → P6 验证 → P7 收尾与交接
```

`P1 → P3` 是**开工前门禁**，未通过不得写业务代码。详细说明见 `references/pipeline.md`。

---

## P0 触发与预检 (Preflight)

1. 判断任务**档位**（见下方"档位分级"），并**向用户声明**本次采用哪一档及理由。
2. 判断任务**类型**：功能开发走 P1-P7；**bug 修复 / 报错排查 / 行为异常类改走 `references/debugging-protocol.md` 的 D0-D5 调试线**（复现 → 假设 → 验证 → 修复 → 回归），并声明。
3. 完成**环境探测**（见上方"环境适配"）：确定任务目录并声明。
4. 确定**分支策略**（见下方"分支隔离策略"）并声明。
5. 读取项目上下文：`README`、依赖清单（`package.json` / `pom.xml` / `requirements.txt` / `go.mod` / `build.gradle`）、目录结构、`git status`。**工作区有未提交改动时，按 `references/git-protocol.md` 第四节先问用户再处理，不得擅自动。**
6. **检查任务目录下是否已有清单 / 交接文档**。若存在，先读 `CHECKLIST.md` 与 `HANDOVER.md`，按 `references/handover-protocol.md` 的续接流程恢复进度。
7. 明确本次任务的 **in-scope / out-of-scope**，主动向用户确认边界。

## P1 澄清 (Clarify) —— 强制门禁

**目标：把"我以为"变成"确认过"。**

严格按 `references/clarification-protocol.md` 执行：

- 一次最多问 **3-5 个**最关键问题，不要一口气抛二十个。
- 必须覆盖的维度：目标 / 用户与场景 / 输入输出 / 技术约束 / 边界与异常 / 验收标准 / 性能与安全。
- 无法从代码或文档推断的点，**要么问用户，要么显式记入"假设登记"**，不允许默默假设。
- 存在多种合理解法时，给出 **2-3 个方案对比**（含取舍），让用户拍板。
- **门禁**：只要还有 Blocking 级未决问题，禁止进入 P2。

## P2 设计定稿 (Design Spec)

- 输出 2-3 套方案对比（改动范围 / 复杂度 / 风险 / 可维护性），给出推荐及理由。
- 定稿后写入设计文档（模板 `assets/templates/design-spec.md`），落到 `<任务目录>/<task-slug>/DESIGN.md`。
- **设计是活文档**：执行中发生设计修订（评审打回 / 架构复盘），先改 `DESIGN.md` 再改代码，修订理由记入决策日志。
- 用户未确认设计前，**禁止写代码**。

## P3 任务清单 (Checklist) —— 强制门禁

- 把任务拆成**原子任务**：每个 2-5 分钟可完成，标注 `文件路径` + `验证方式`。
- 按模板 `assets/templates/task-checklist.md` 写清单，落到 `<任务目录>/<task-slug>/CHECKLIST.md`。
- 清单必须包含：任务目标、DoD（完成定义）、任务列表（状态用 `[ ] / [~] / [x]`）、风险登记、决策日志、假设登记。
- 测试要求写进 DoD：核心路径有测试覆盖，业务逻辑改动有对应断言（详见 `references/testing-protocol.md` 第一节）。
- **门禁**：清单未落盘，禁止开始 P4。

## P4 执行 (Execute)

- 按清单**分批执行**，每批 1-3 个原子任务后回到清单更新状态。
- **活文档纪律**（见 `references/living-docs-protocol.md`）：清单是唯一事实源——新假设 / 新决策 / 新风险 / 验证证据**发生即写入**，不许攒着；每批结束顺手刷新 `HANDOVER.md` 的"进度与下一步"，保证任意时刻中断都可续接。
- 涉及业务逻辑的改动遵循 **TDD（红-绿-重构）**：先写失败测试 → 最小实现转绿 → 重构。测试本身的质量标准（测行为不测实现、覆盖边界与异常、确定性）按 `references/testing-protocol.md` 第二节自查，反模式清单见其第三节。
- 无依赖的独立任务可派发**并行子代理**加速。
- 任务进度跟踪按环境适配：有任务管理工具就用（进入任务前置 `in_progress`，完成后立即置 `completed`）；没有则以清单文件的状态流转为准。
- 遵守**范围守卫**：不擅自扩大改动范围；发现范围外的问题，记入清单"发现事项"，问过用户再动。
- 关键节点打**回滚点**（git commit / 分支），保证可回退。**提交时机 / message / 内容卫生按 `references/git-protocol.md` 第一至三节执行：每批末测试转绿后 commit 一次。**

## P5 独立评审 (Review)

- 由**独立视角**（子代理或切换立场）对照设计文档与清单做**三阶段**检查：
  1. 规格符合度：是否满足需求与 DoD。
  2. 代码质量：命名、边界、错误处理、安全、性能、可读性。
  3. 测试质量：对照 `references/testing-protocol.md` 反模式清单检查；核对边界与异常覆盖；确认无未解释的 skip / 删除测试。
- 评审结论写入清单，问题逐条修复后复核；测试质量问题与代码质量问题**同等阻塞**。
- **评审必须真正独立**：优先派发子代理（模板如下）；确实无法派发时才切换立场自查，并在清单注明"自查"。
  > 独立评审以下改动，不要修改任何代码：对照 `<任务目录>/<slug>/DESIGN.md` 与 `CHECKLIST.md` 做三阶段检查——① 规格符合度（对照 DoD）② 代码质量（命名/边界/错误处理/安全/性能）③ 测试质量（反模式清单见 testing-protocol.md 第三节）。按 **严重（阻塞）/ 一般 / 建议** 三级输出问题清单。

## P6 验证 (Verify) —— 完成前强制

- **证据优先**：运行真实命令（测试、构建、lint、启动服务、curl 接口），把关键输出贴进清单。测试证据须含通过/失败/跳过数，**skip 逐条给理由**。
- 禁止用"应该可以""大概没问题"作为完成依据；**禁止靠删除或跳过测试转绿**（见 `references/testing-protocol.md` 第五节）。
- **缺陷回流**：验证中发现的任何缺陷，修复前先写复现它的失败测试，修复后该测试永久保留为回归防线。
- **连续 3 次修复失败 → 停止打补丁**，按 `references/debugging-protocol.md` 的升级规则回到 D2/P2 做根因或架构级复盘。

## P7 收尾与交接 (Wrap-up & Handover)

1. **更新清单**：所有任务状态置终态，补全"实际结果 / 遗留问题"。
2. **测试债务台账**：未覆盖路径、flaky 测试、改进建议记入清单遗留问题，续接时优先纳入新任务 DoD（见 `references/testing-protocol.md` 第七节）。
3. **写决策日志**：本次关键技术选型及理由。
4. **判断是否该开启新对话**（标准见 `references/handover-protocol.md`）。
5. 若需要新对话 → 写 `HANDOVER.md`（模板 `assets/templates/handover.md`），并在回复中明确告知用户"建议开新对话并附上该文件"。
6. **分支终局**：任务完成且验证通过后，按 `references/git-protocol.md` 第五节向用户提供合并 / PR / 保留 / 丢弃四个选项；验证未通过不提供合并选项。
7. 有长期价值的结论写入长期记忆（按环境适配选择：平台 memory / `CLAUDE.md` / `AGENTS.md` / 项目笔记）。

---

## 档位分级 (Scaling)

| 档位 | 触发条件 | 流程 |
|------|----------|------|
| 精简 | 单文件、明确小改动、15 分钟内（改文案、调样式、修小 bug） | P1(轻) → P3 → P4 → P6 → P7 |
| 标准 | 常规功能开发、多文件、需设计 | P0-P7 全流程（**默认**） |
| 严格 | 架构改动、跨模块、涉及数据 / 安全 / 支付 | 全流程 + 设计文档评审 + 独立子代理评审 + 完整测试覆盖 |

档位由你判断，但必须向用户声明；用户可随时升降档。

## 用户紧急通道 (Bypass)

流程为用户服务，不是用户为流程服务。**用户明确要求跳过流程时（"别问了直接改"、"不用走清单"），尊重用户，降级为最小执行**：

1. 直接修改，不再追问、不再强制落盘清单。
2. 两条不可豁免的底线：**不靠删除/跳过测试转绿；改完必须至少跑一次验证**（哪怕手动确认）。
3. 豁免记入决策日志（一条"用户豁免"条目即可），后续同类任务不再重复追问。
4. **唯一例外**：改动涉及数据 / 安全 / 支付（严格档红线）时，必须提醒一次风险，用户仍坚持才执行。

## 分支隔离策略 (Branch Isolation)

主分支（`main` / `master`）**禁止直接开发**。开工前按档位确定分支：

| 档位 | 策略 |
|------|------|
| 精简 | 可直接在当前工作分支进行，但必须先打回滚点（commit） |
| 标准 | **默认新建功能分支**（如 `feat/<task-slug>`），完成后由用户决定合并方式 |
| 严格 | **强制新建分支**；涉及大架构改动时优先用 worktree 隔离（若环境支持），保持主工作区可用 |

分支与回滚点信息记入清单"回滚点"小节。commit 规范、提交卫生、脏工作区处理、分支终局（合并/PR/保留/丢弃四选项）与破坏性操作红线，统一见 `references/git-protocol.md`。

## 内置增强项

除强制流程外，本 skill 还内建以下自研机制：

1. **假设登记 (Assumption Log)** —— 把默默做的假设显式化，出问题时能定位是哪个假设错了。
2. **决策日志 (Decision Log)** —— 记录"为什么这么选"，避免反复推翻，方便交接。
3. **风险登记 (Risk Register)** —— 开工前预判风险与缓解措施。
4. **范围守卫 (Scope Guard)** —— 显式 in-scope / out-of-scope，防 scope creep。
5. **完成定义 (DoD)** —— 每个任务先定义"什么样才算做完"。
6. **回滚点 (Rollback Points)** —— 关键节点可回退。
7. **证据优先 (Evidence over Claims)** —— 完成必须有真实命令输出。
8. **架构红线复盘** —— 连续 3 次修不好就停手复盘，不打补丁。
9. **续接优先 (Resume First)** —— 检测到既有清单 / 交接文档，先读再干。
10. **环境自检 (Preflight)** —— 动手前确认依赖、构建、git 状态可用。
11. **调试线 (Debug Track)** —— bug 类任务路由到独立调试协议：未复现不改码、未定位根因不打补丁、修复必带回归测试。
12. **分支隔离 (Branch Isolation)** —— 主分支禁止直接开发，标准/严格档强制新分支。
13. **测试质量闭环 (Test Quality Loop)** —— 测试标准进 DoD → TDD 反模式自查 → 评审三阶段含测试质量 → 证据含覆盖说明 → 缺陷固化回归测试 → 测试债务台账。每个被发现过的 bug 都变成一条永久防线。
14. **活文档 (Living Documents)** —— 清单是唯一事实源，假设/决策/风险/证据发生即落盘；HANDOVER 从 P4 起随批刷新，任意时刻中断都能续接；设计与代码不允许长期不一致。
15. **用户紧急通道 (Bypass)** —— 用户明确说"直接改"时降级为最小执行：不追问、不强制清单，但保留"不删测试转绿"与"事后必须验证"两条底线；豁免记入决策日志。
16. **Git 操作规范 (Git Protocol)** —— 每批末测试转绿后 commit；Conventional Commits；过程文档默认不提交；不碰用户未提交改动；分支终局四选项；force push / 丢弃改动等破坏性操作默认禁止。

## 协议加载地图 —— 何时读哪份

references 按需加载，**不要一次全读**。对照下表，进入对应阶段/场景时才读取该文件：

| 阶段 / 场景 | 按需加载 |
|------|----------|
| P1 澄清 | `references/clarification-protocol.md` |
| P4 执行、P7 收尾 | `references/living-docs-protocol.md` |
| P4 TDD 自查、P5 评审、P6 证据 | `references/testing-protocol.md` |
| P0 路由为 bug 后的全程 | `references/debugging-protocol.md` |
| P0 脏工作区、P4 提交、P7 分支终局 | `references/git-protocol.md` |
| P0 续接、P7 判定新对话 | `references/handover-protocol.md` |
| 阶段细节展开（P0-P7 详解） | `references/pipeline.md` |
| 安装 / 调用 / 派发子代理 / 排障 | `references/invocation.md` |

## 资源

- `references/invocation.md` —— 安装位置（跨平台）、四种调用方式、派发给子代理的标准模板、跨对话续接、排障
- `references/pipeline.md` —— 完整流水线详解 + 与 superpowers 的逐项对应
- `references/debugging-protocol.md` —— 系统性调试协议（bug 类任务专用：复现 → 假设 → 验证 → 修复 → 回归）
- `references/testing-protocol.md` —— 测试质量闭环协议（测试标准、反模式清单、评审维度、缺陷回流、测试债务台账）
- `references/clarification-protocol.md` —— 追问澄清协议（问什么、怎么问、何时算够）
- `references/handover-protocol.md` —— 新对话判定标准 + 交接文档规范
- `references/git-protocol.md` —— Git 操作规范（提交时机与 message、提交卫生、脏工作区、分支终局四选项、破坏性操作红线）
- `references/living-docs-protocol.md` —— 活文档协议（事件驱动更新、中途交接、设计同步、中断恢复）
- `assets/templates/task-checklist.md` —— 工作清单模板
- `assets/templates/design-spec.md` —— 设计文档模板
- `assets/templates/handover.md` —— 交接文档模板

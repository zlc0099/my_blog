# PERSONAL ARCHIVE · 实施方案

> 状态：开发完成，本地仓库已初始化；待推送 main 并部署
> 日期：2026-10-26
> 技术栈：Vue 3 + Vite + Markdown，纯静态，GitHub Pages
> 目标仓库：<https://github.com/zlc0099/my_blog>（远端目前为空）

## 1. 定位

将个人学习记录做成一套**持续更新的技术档案系统**，而不是普通博客模板。

- 内容：技术笔记、项目记录、Bug 复盘、Agent 工作流、Token 消耗、技能与提示词。
- 视觉：明日方舟官网式的编辑排版 + 深色工业科幻 + 克制的橙色锚点。
- 原则：长期可读、可检索、可维护；不伪造数据，不依赖后端。

## 2. 已确认决策

1. **AI LAB 独立入口**：`/lab` 作业记录与 Token 账本，`/lab/skills` 技能库，`/lab/prompts` 提示词与工作流。
2. **Token 数据手动维护 + DEMO 示例**：`src/data/usage.json`，示例数据带明确 `DEMO DATA` 标记，替换后关闭标记。
3. **首版内容**：5 篇标注 `SAMPLE` 的示例文章 + 3 个真实项目（20 Best Anime / Yuki Pet / MySkill Workflow Kit）。
4. **主题**：深色默认，完整实现 PAPER DOSSIER 浅色主题，localStorage 持久化。

## 3. 信息架构

```
/                     首页（Hero / 最近记录 / 学习领域 / AI LAB 概览 / 当前专注 / 精选项目 / 时间线）
/posts                知识档案（搜索 + 分类 + 标签 + 加载更多）
/posts/:slug          文章详情（目录、代码复制、上下篇、相关笔记）
/categories/:slug     分类档案
/tags/:slug           标签档案
/projects             项目记录
/projects/:slug       项目详情
/lab                  AGENT OPERATIONS（作业记录 + Token 账本）
/lab/skills           技能库
/lab/prompts          提示词与工作流
/timeline             学习时间线
/about                关于我
*                     404
```

顶部导航：`PERSONAL ARCHIVE`｜首页 / 档案 / 项目 / AI LAB / 时间线｜搜索（Ctrl+K）/ 主题 / 关于。

## 4. 视觉系统

- 色彩：石墨黑底 + 高对比文字 + 橙色（#F5A623）作选中、编号、CTA、图表强调，不做大面积铺色。
- 字体：Barlow Condensed（英文标题）、Inter（拉丁正文）、系统中文字体、JetBrains Mono（代码），自托管拉丁字体。
- 版式：1200px 内容宽度、760px 正文、240px TOC；非对称网格、细线分隔、切角面板、点阵底纹、原创雷达刻度徽记。
- 编号：`ARCH-000` 文章、`OPS-00` 项目、`AGT-00` 智能体、`SKL-00` 技能、`PRO-00` 提示词。
- 动效：入场位移、悬停线条、数字与图表渐入；全部尊重 `prefers-reduced-motion`。
- 浅色主题：暖白纸档案（PAPER DOSSIER），完整覆盖导航、正文、代码、标签、弹层、图表和所有状态。

## 5. 内容与数据

### 文章

`src/content/posts/*.md`，frontmatter：

```yaml
title: 标题
slug: 唯一 slug
date: 2026-10-20
updated: 2026-10-22
category: backend   # backend / frontend / database / engineering / ai-tools
tags: [spring-boot, architecture]
summary: 一句话摘要
featured: true
sample: true        # 示例文章标记，替换为真实内容后删除
project: slug       # 可选，关联项目
```

阅读时间按 CJK 字符 + 英文单词估算，分类/标签/数量/上下篇/相关文章全部由数据计算。

### 项目

`src/content/projects/*.md`，frontmatter 包含 `title`、`slug`、`status`、`period`、`date`、`stack`、`repo`、`demo`、`summary`、`featured`、`related`。封面为按 slug 生成的确定性 SVG 蓝图，不依赖图片素材。

### AI LAB

- `src/data/agents.js`：Claude Code / Qoder / Trae 档案。
- `src/data/usage.json`：`demo` 标记 + 逐条作业记录（日期、工具、任务、类型、输入/输出 token、关联文章）。
- `src/data/skills.js`：来自真实本地技能的 3 个 SKILL。
- `src/data/prompts.js` / `workflows.js`：全栈、后端、前端、排障、Agent Skill 模板与工作流。
- 图表使用原生 CSS/SVG，不引入图表库；无数据时显示空状态。

## 6. 技术方案

- 依赖：`vue`、`vue-router`、`markdown-it`、`markdown-it-anchor`、`highlight.js`、`js-yaml`、`github-slugger`、`@fontsource/*`。
- 不引入 UI 库、CSS 框架、图表库、状态管理库。
- Markdown 通过 `import.meta.glob` 打包，frontmatter 用 js-yaml 解析；代码高亮仅注册实际用到的语言。
- 搜索：本地索引 + `Ctrl/Cmd+K` 原生 dialog 搜索层；文章页筛选状态同步到 URL。
- 路由：history 模式，`base` 按仓库名自动适配；GitHub Pages 用 `404.html` 兜底深链接。
- 部署：GitHub Actions（Pages），`main` / `master` 推送触发。

## 7. 实施阶段

- [x] 方案确认
- [x] 工程骨架与依赖
- [x] 设计 Token / 字体 / 布局壳
- [x] 内容层与种子数据
- [x] 首页
- [x] 档案列表 / 筛选 / 分类 / 标签
- [x] 文章详情 / 项目页
- [x] AI LAB / 时间线 / 关于
- [x] 搜索 / 元信息 / 404
- [x] 响应式 / 浅色主题 / 验收
- [x] README 与部署配置
- [x] 本地 Git 初始化与提交
- [ ] 推送 main 并启用 GitHub Pages（按用户选择，由用户手动执行）

## 8. 验收标准

- `npm run build` 通过，无编译错误。
- 导航、文章、分类、标签、项目全部可跳转。
- 搜索、分类、标签筛选真实生效，状态可清除，无结果有空状态。
- TOC 自动生成、滚动高亮、移动端可折叠；代码可复制并有成功/失败反馈。
- 深浅主题完整切换并持久化；移动端无横向溢出。
- `prefers-reduced-motion` 下无干扰动画。
- 浏览器控制台无报错。

## 9. 已知边界

- 纯静态 SPA：搜索引擎对文章内容的收录有限，分享卡片依赖客户端或后续预渲染。
- 无登录、无后台、无真实接口；文章与数据均通过仓库文件维护。
- Token / 作业记录当前为明确标注的演示数据，需用户替换为真实记录。
- GitHub 仓库创建与推送需用户确认后执行。

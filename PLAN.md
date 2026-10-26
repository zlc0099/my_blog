# PERSONAL ARCHIVE · 实施方案

> 状态：开发完成；真实 Claude Code 数据、首页改版与 AI LAB 会话记录表已完成；功能批次待提交、推送与部署
> 日期：2026-10-26
> 技术栈：Vue 3 + Vite + Markdown，纯静态，GitHub Pages
> 目标仓库：<https://github.com/zlc0099/my_blog>（远端目前为空）

## 1. 定位

将个人学习记录做成一套**持续更新的技术档案系统**，而不是普通博客模板。

- 内容：技术笔记、项目记录、Bug 复盘、Agent 工作流、Token 消耗、技能与提示词。
- 视觉：明日方舟官网式的编辑排版 + 深色工业科幻 + 克制的橙色锚点。
- 原则：长期可读、可检索、可维护；不伪造数据，不依赖后端。

## 2. 已确认决策

1. **档案分类**：内容档案按 `学习记录 / Skill / 前端提示词 / 后端提示词 / AI 分工` 五个模块分类。
2. **AI LAB 只保留**：Agent 分工档案、真实 Claude Code Token 账本和会话记录表格；技能库与提示词页面从 AI LAB 移除。
3. **提示词挂载**：文章 frontmatter 用 `prompts: [PRO-02]` 引用提示词，展示在相关文章正文下方；没有独立提示词页面。
4. **时间线移除**：路由、导航、页脚、首页索引和关于页全部不再包含时间线。
5. **Claude Code Token 自动导入**：本地 JSONL 日志 → `usage.json`；缓存读写独立展示；原始对话不进入仓库。Qoder / Trae 手动记录。
6. **首页**：只介绍本人和这个站，说明日常用途、档案分类和技术说明；不渲染文章、项目、图表等模块内容。
7. **主题与头像**：深色默认，完整 PAPER DOSSIER 浅色主题；右上角 GitHub 头像本地托管。

## 3. 信息架构

```
/                     首页（个人简介 / 日常用途 / 站内索引 / 技术说明）
/posts                内容档案（学习记录 / Skill / 前端提示词 / 后端提示词 / AI 分工）
/posts/:slug          文章详情（目录、代码复制、上下篇、相关笔记、相关提示词）
/categories/:slug     分类档案
/tags/:slug           标签档案
/projects             项目记录
/projects/:slug       项目详情
/lab                  AGENT OPERATIONS（Agent 档案 + Token 账本 + 会话记录）
/about                关于我
*                     404
```

顶部导航：`PERSONAL ARCHIVE`｜首页 / 档案 / 项目 / AI LAB｜搜索（Ctrl+K）/ 主题 / 关于。

## 4. 视觉系统

- 色彩：石墨黑底 + 高对比文字 + 橙色（#F5A623）作选中、编号、CTA、图表强调，不做大面积铺色。
- 字体：Barlow Condensed（英文标题）、Inter（拉丁正文）、系统中文字体、JetBrains Mono（代码），自托管拉丁字体。
- 版式：1200px 内容宽度、760px 正文、240px TOC；非对称网格、细线分隔、切角面板、点阵底纹、原创雷达刻度徽记。
- 编号：`ARCH-000` 文章、`OPS-00` 项目、`AGT-00` 智能体、`SKL-00` 技能、`PRO-00` 提示词。
- 背景：`html` 固定底色，`body` 透明，面板使用半透明 Token；固定粒子画布以极慢速度漂浮。
- 光标：鼠标小拖尾和点击涟漪，使用低透明度恒定色；触屏和 `prefers-reduced-motion` 下自动关闭。
- 进场：同一标签页首次整页进入时显示进度条加载动画，完成后中央亮线展开、左右面板从中间分开、页面淡入；点击或 Enter / Space 跳过，刷新同 tab 和内部路由不重复出现。
- 可读性：辅助文字保持最小 10px，正文 16–18px；不牺牲长文阅读。
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
- `scripts/import-claude-usage.mjs`：读取本机 `~/.claude/projects/**/*.jsonl`，按 session 去重聚合；仅写 token、模型、时间、项目标签与会话 ID，不写对话原文；保留已有手写笔记。
- `src/data/usage.json`：`source: claude-code-logs` + 20 条真实会话记录（日期、模型、项目、input/output、cache read/write、会话 ID、笔记 slug）。
- `src/content/sessions/*.md`：可选本地 Markdown 笔记文件；导入时可生成，站点不读取、不展示、不搜索。
- Skill 文章：`/categories/skill` 分为 **自制 Skill（3 条）** 与 **常用 Skill（非自制，11 条）**。3 个自制技能为完整 SKILL.md 主体，文章顶部链接 GitHub 的 `myskill/<name>/`；`superpowers` 为实际调用记录总览，其余本机安装技能与 Anthropic 合集为用途摘要。
- 本地技能源码放在仓库 `myskill/`，构建不打包；`src/content/sessions/` 为本地笔记目录，默认不提交。
- AI LAB 图表按 `CACHE READ / NEW INPUT / OUTPUT` 堆叠；会话表支持 Agent / 项目 / 模型筛选和时长。
- 提示词：`src/data/prompts.js` 保存模板；文章 frontmatter 用 `prompts` 引用，正文下方渲染 `RelatedPrompts`；全局搜索可索引提示词并跳到 `#PRO-xx`。
- 前端 / 后端提示词分类各有一篇模板文章，文章下方挂载对应提示词。
- 图表使用原生 CSS/SVG，不引入图表库；总量包含缓存读写，页面分项展示；无数据时显示空状态。
- Qoder / Trae 暂无自动日志，标记为无数据，可手动追加 `manual: true` 记录。

## 6. 技术方案

- 依赖：`vue`、`vue-router`、`markdown-it`、`markdown-it-anchor`、`highlight.js`、`js-yaml`、`github-slugger`、`@fontsource/*`。
- 不引入 UI 库、CSS 框架、图表库、状态管理库。
- Markdown 通过 `import.meta.glob` 打包，frontmatter 用 js-yaml 解析；代码高亮仅注册实际用到的语言。
- 搜索：本地索引 + `Ctrl/Cmd+K` 原生 dialog 搜索层；索引包含文章、项目和提示词；文章页筛选状态同步到 URL。
- 路由：history 模式，`base` 按仓库名自动适配；GitHub Pages 用 `404.html` 兜底深链接。
- 部署：GitHub Actions（Pages），`main` / `master` 推送触发。
- 数据导入：Node 脚本 `npm run import:claude`，手动执行，不进入构建流程。
- 全局特效：`ParticleField.vue`（粒子背景，z-index -1）、`CursorEffects.vue`（拖尾 / 涟漪，z-index 90，pointer-events: none）和 `BootScreen.vue`（z-index 300，进度条 + 中缝展开）；均使用原生 Canvas / CSS，尊重 reduced-motion。

## 7. 实施阶段

- [x] 方案确认
- [x] 工程骨架与依赖
- [x] 设计 Token / 字体 / 布局壳
- [x] 内容层与种子数据
- [x] 首页
- [x] 档案列表 / 筛选 / 分类 / 标签
- [x] 文章详情 / 项目页
- [x] AI LAB / 关于
- [x] 档案五分类（学习记录 / Skill / 前后端提示词 / AI 分工）
- [x] 提示词挂载到相关文章
- [x] 时间线模块整体移除
- [x] 搜索 / 元信息 / 404
- [x] 响应式 / 浅色主题 / 验收
- [x] README 与部署配置
- [x] 本地 Git 初始化与提交
- [x] GitHub 头像（本地托管）
- [x] Claude Code Token 导入脚本与真实数据
- [x] 缓存读写分区展示
- [x] 首页改为项目介绍
- [x] AI LAB 会话记录表，移除 note 展示
- [x] 半透明背景 + 缓慢粒子 + 光标拖尾/点击特效
- [x] 首次进入进度条动画与中缝展开
- [ ] 提交本轮功能批次（待用户确认）
- [ ] 推送 main 并启用 GitHub Pages（按用户选择，由用户手动执行）

## 8. 验收标准

- `npm run build` 通过，无编译错误。
- 导航、文章、分类、标签、项目全部可跳转。
- 搜索、分类、标签筛选真实生效，状态可清除，无结果有空状态。
- TOC 自动生成、滚动高亮、移动端可折叠；代码可复制并有成功/失败反馈。
- 深浅主题完整切换并持久化；移动端无横向溢出。
- `prefers-reduced-motion` 下无干扰动画。
- 浏览器控制台无报错。
- 五个档案分类、Skill 自制/常用分组、自制技能 GitHub 源码入口、提示词挂载与复制、AI LAB Token 分型图 + 会话筛选/时长、首页分类索引、移动端布局通过检查。
- 粒子背景、光标拖尾和点击涟漪通过检查；reduced-motion 下粒子静止且不加载光标特效。
- 进场进度条、面板展开、点击跳过和内部导航不重复出现通过检查。
- 时间线、AI LAB 技能库、AI LAB 提示词页面已移除且旧路由返回 404。
- 站点不显示 note；本地笔记文件可选生成。

## 9. 已知边界

- 纯静态 SPA：搜索引擎对文章内容的收录有限，分享卡片依赖客户端或后续预渲染。
- 无登录、无后台、无真实接口；文章、项目与数据均通过仓库文件维护。
- Token 数据来自本机 Claude Code 日志，包含 cache read/write；不包含 Qoder / Trae 自动日志。
- 会话记录不包含 note 或原始对话；没有站内编辑器。
- 前后端提示词文章目前是个人模板（标 SAMPLE），不是本地 SKILL.md 原文；3 个自制技能已导入 SKILL.md 主体，但 references/ 未全部搬入，完整目录通过 GitHub 链接查看；其他常用技能条目是用途摘要。
- 本地功能批次与真实数据尚未提交；远端为空，推送需用户确认后执行。

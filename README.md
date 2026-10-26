# PERSONAL ARCHIVE · 个人技术学习档案

> 把个人学习记录做成一套持续更新的技术档案。  
> 深色工业科幻视觉 · 中文长文阅读 · 文章检索 · Agent 作业与 Token 账本。

纯前端静态站点，无后端、无登录、无数据库。文章是仓库里的 Markdown，Agent / Token 数据是仓库里的 JSON；构建后可直接部署到 GitHub Pages。

- 仓库：<https://github.com/zlc0099/my_blog>
- 线上地址：<https://zlc0099.github.io/my_blog/>（启用 GitHub Pages 后）

## 功能

- **首页技术档案**：非对称 Hero 档案板、最近记录、学习领域、Agent 资源概览、当前专注、精选项目、学习时间线。
- **知识档案**：全文搜索、分类筛选、标签筛选、URL 状态同步、加载更多、空状态。
- **文章详情**：Markdown 渲染、代码高亮与真实复制、自动目录、滚动章节高亮、阅读进度、上下篇、按标签计算的相关笔记、示例文章标记。
- **项目记录**：确定性 SVG 蓝图封面、项目档案侧栏、技术栈、真实仓库 / 演示链接、关联笔记。
- **AI LAB**：Claude Code / Qoder / Trae 分工档案、月度 Token 堆叠图、输入输出统计、作业明细、技能库、提示词与工作流。
- **主题**：默认深色工业风；完整 PAPER DOSSIER 浅色主题，localStorage 持久化。
- **搜索**：`Ctrl/Cmd + K` 打开全站搜索，覆盖文章、项目、技能和提示词，支持键盘上下选择与 Enter 打开。
- **响应式**：360 / 768 / 1440 三档视口验证，无页面横向溢出；移动端导航、目录、代码块单独适配。
- **可访问性**：语义化标题、跳过导航、键盘焦点、`prefers-reduced-motion`、图表提供数据表。

## 技术栈

- Vue 3 + Vue Router 5 + Vite 8
- markdown-it + markdown-it-anchor + highlight.js + js-yaml + github-slugger
- 自托管拉丁字体（Barlow Condensed / Inter / JetBrains Mono），中文使用系统字体栈
- 无 UI 库、无图表库、无 CSS 框架

## 本地运行

需要 Node.js 20+（推荐 22 / 24）。

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # 产物在 dist/
npm run preview   # 本地预览生产构建
```

## 目录结构

```text
src/
├─ content/
│  ├─ posts/          # 文章 Markdown
│  └─ projects/       # 项目 Markdown
├─ data/              # 站点、分类、专注目标、Agent、Token、技能、提示词、里程碑
├─ lib/               # 内容加载、Markdown 渲染、搜索索引、Token 聚合、格式化
├─ composables/       # 主题、页面元信息、搜索浮层状态
├─ components/        # 布局、首页、文章、项目、AI LAB、时间线与通用 UI
├─ views/             # 路由页面
├─ styles/            # Design Token、基础样式、Markdown 排版
├─ router.js
└─ main.js
```

## 内容维护

### 新增文章

在 `src/content/posts/` 新建 Markdown 文件：

```yaml
---
title: 文章标题
slug: unique-article-slug
date: 2026-10-26
updated: 2026-10-26
category: backend
tags: [spring-boot, architecture]
summary: 一句话摘要，会显示在列表和搜索结果里。
featured: false
sample: true
project: optional-project-slug
---
```

- `category` 必须是 `src/data/taxonomy.js` 中的五个分类之一：`backend`、`frontend`、`database`、`engineering`、`ai-tools`。
- `sample: true` 会在页面显示 `SAMPLE` 标记；替换为真实内容后删除该字段或改为 `false`。
- 日期建议保持 `YYYY-MM-DD`。**frontmatter 里的日期、项目周期建议加引号**，避免 YAML 把 `2026.10` 解析成数字 `2026.1`。
- 阅读时间按中日文字符 + 英文单词自动估算。
- 分类数量、标签、归档编号、上下篇、相关笔记、时间线和搜索索引都会自动更新。

### 新增项目

在 `src/content/projects/` 新建 Markdown：

```yaml
---
title: 项目名称
slug: project-slug
date: 2026-10-26
period: "2026.10"
status: 开发中
summary: 项目简介。
stack: [Vue 3, Vite, Rust]
repo: https://github.com/your/repo
demo: https://your-demo.example.com
featured: true
related: [related-post-slug]
---
```

- `repo` / `demo` 留空时页面不会显示对应按钮，不生成假链接。
- 封面由 slug 生成确定性 SVG，不需要图片素材。
- 项目正文推荐使用 `背景 / 目标 / 实现 / 关键问题 / 结果 / 复盘` 结构。

### 当前专注、关于与里程碑

- `src/data/site.js`：品牌名、简介、角色、GitHub、学习理念。
- `src/data/focus.js`：首页与关于页的当前学习目标，手动维护。
- `src/data/milestones.js`：时间线中手动维护的阶段里程碑。
- `src/data/taxonomy.js`：分类和提示词目标。

### Agent 与 Token 账本

- `src/data/agents.js`：Claude Code / Qoder / Trae 的档案、模式与分工描述。
- `src/data/usage.json`：逐条作业记录。

```json
{
  "demo": true,
  "updated": "2026-10-26",
  "note": "示例数据，仅用于展示账本结构。",
  "records": [
    {
      "date": "2026-10-24",
      "agent": "claude-code",
      "task": "任务名称",
      "type": "feature",
      "tokensIn": 120000,
      "tokensOut": 30000,
      "post": "optional-post-slug"
    }
  ]
}
```

- 支持的类型：`feature` / `refactor` / `debug` / `review` / `doc`。
- 月度图表、工具占比、总量和平均值全部由记录计算。
- 当前数据是**明确标注的演示数据**。替换为真实记录后把 `demo` 改为 `false`，页面上的 `DEMO DATA` 标记会消失。
- 没有自动采集接口；需要持续手动维护。

### 技能与提示词

- `src/data/skills.js`：技能名称、能力、兼容 Agent、调用方式。
- `src/data/prompts.js`：提示词模板，页面提供真实复制按钮。
- `src/data/workflows.js`：首页 / 提示词页展示的工作流步骤。

## 主题

- 深色为默认主题；浅色主题为 PAPER DOSSIER。
- 主题使用 `html[data-theme]` + CSS Variables，保存在 `localStorage` 的 `pa-theme`。
- 代码块在两套主题下都保持深色，减少阅读时的视觉跳变。
- 所有动画尊重 `prefers-reduced-motion`。

## 部署到 GitHub Pages

当前目标仓库：`https://github.com/zlc0099/my_blog.git`。

1. 本地初始化并推送：

   ```bash
   git init -b main
   git add .
   git commit -m "feat: PERSONAL ARCHIVE 个人技术档案"
   git remote add origin https://github.com/zlc0099/my_blog.git
   git push -u origin main
   ```

2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. `.github/workflows/deploy.yml` 会自动构建并部署。首次 push 或手动 `workflow_dispatch` 触发。
4. 部署完成后访问 <https://zlc0099.github.io/my_blog/>。

构建时 `base` 会自动读取 `GITHUB_REPOSITORY`：

- 普通项目仓库 → `/<repo>/`
- `<name>.github.io` 用户主页仓库 → `/`
- 也可以在 CI 中通过 `BASE_PATH` 覆盖。

深链接（例如 `/posts/xxx`）通过构建时复制 `dist/index.html` → `dist/404.html` 兜底。GitHub Pages 会返回 404 状态码但渲染 SPA，分享和直接访问都能正常打开。

## 验收清单

本地已实际执行并通过：

- `npm run build` 无错误。
- 69 + 31 项浏览器检查，0 控制台错误、0 失败请求。
- 首页 / 档案 / 分类 / 标签 / 项目 / AI LAB / 时间线 / 关于 / 404 全部可访问。
- 搜索、分类筛选、标签筛选、清除筛选、URL 同步有效。
- 目录自动生成、锚点跳转、滚动高亮有效。
- 代码复制成功反馈与剪贴板内容验证成功。
- 深浅主题切换并持久化；浅色覆盖文章、代码块、搜索浮层、AI LAB 和 404。
- 360 / 768 / 1440 无页面横向溢出；移动端菜单与折叠目录正常。

## 已知边界

- 纯静态 SPA，页面 SEO 元信息由客户端更新；搜索引擎对文章正文的收录有限。
- 无登录、评论、后台与真实接口；所有内容通过仓库文件维护。
- 不支持数学公式；如需公式可增加 KaTeX 插件。
- 图片需要自行放入 `public/` 或以可访问 URL 引用；加载失败时有虚线占位样式。
- Token / 作业记录当前为演示数据，示例文章带 `SAMPLE` 标记。
- GitHub 仓库创建与推送需要由仓库所有者确认后执行。

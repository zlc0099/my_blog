# PERSONAL ARCHIVE · 个人技术学习档案

> 把个人学习记录做成一套持续更新的技术档案。  
> 深色工业科幻视觉 · 中文长文阅读 · 真实 Agent 资源账本 · 个人学习记录。

纯前端静态站点，无后端、无登录、无数据库。文章和项目是仓库里的 Markdown，Agent / Token 数据由本地 Claude Code 日志聚合到 JSON；构建后部署到 GitHub Pages。

- 仓库：<https://github.com/zlc0099/my_blog>
- 线上地址：<https://zlc0099.github.io/my_blog/>（启用 GitHub Pages 后）

## 功能

- **项目介绍首页**：个人简介、日常用途、站内索引、技术说明与 GitHub 头像；不展示文章、项目、图表等其他模块内容。
- **知识档案**：全文搜索、分类筛选、标签筛选、URL 状态同步、加载更多、空状态。
- **文章详情**：Markdown 渲染、代码高亮与真实复制、自动目录、滚动章节高亮、阅读进度、上下篇、按标签计算的相关笔记、文章下方挂载相关提示词、示例文章标记。
- **项目记录**：确定性 SVG 蓝图封面、项目档案侧栏、技术栈、真实仓库 / 演示链接、关联笔记。
- **AI LAB**：Claude Code / Qoder / Trae 分工档案、真实 Claude Code Token 账本、按 `CACHE READ / NEW INPUT / OUTPUT` 分型的月度图，以及支持 Agent / 项目 / 模型筛选和时长的会话记录。
- **会话记录**：AI LAB 以表格展示本地 Claude Code 日志聚合出的日期、时长、Agent、项目、类型与 Token；不展示 note、原始对话或详情页。
- **进场动画**：同一个标签页首次整页进入时显示一次进度条加载动画，完成后中央亮线展开、左右面板从中间分开、首页内容淡入；点击或按 Enter / Space 可跳过，刷新同 tab 和内部路由不会重复出现。
- **背景与动效**：固定粒子层缓慢漂浮，面板改为半透明；鼠标有小拖尾、点击有涟漪微特效（参考 Arknights 官网氛围，原创实现，不使用官方素材）。`prefers-reduced-motion` 或触屏设备会自动关闭光标特效和进场动画。
- **主题**：默认深色工业风；完整 PAPER DOSSIER 浅色主题，localStorage 持久化。
- **搜索**：`Ctrl/Cmd + K` 打开全站搜索，覆盖文章、项目和提示词；提示词结果会跳到对应文章的 `#PRO-xx` 锚点。
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
│  ├─ projects/       # 项目 Markdown
│  └─ sessions/       # 可选本地 Markdown 笔记文件（站点不展示）
├─ data/              # 站点、分类、专注目标、Agent、Token、提示词
├─ lib/               # 内容加载、Markdown 渲染、搜索索引、Token 聚合、格式化
├─ composables/       # 主题、页面元信息、搜索浮层状态
├─ components/        # 布局、首页、文章、项目、AI LAB 与通用 UI
myskill/               # 本地 Skill 源码（自制技能与常用技能）
├─ views/             # 路由页面
├─ styles/            # Design Token、基础样式、Markdown 排版
├─ router.js
└─ main.js
scripts/
└─ import-claude-usage.mjs  # 从本地 Claude Code JSONL 日志聚合 Token
```

## 头像

右上角头像使用本地文件 `public/avatar.jpg`，避免依赖 GitHub 图片外链。更换头像时替换这个文件，并在 `src/data/site.js` 中保持 `avatar: 'avatar.jpg'`；头像链接始终指向 `site.github`。

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

- `category` 必须是 `src/data/taxonomy.js` 中的五个分类之一：`notes`（学习记录）、`skill`（Skill）、`frontend-prompts`（前端提示词）、`backend-prompts`（后端提示词）、`ai-division`（AI 分工）。
- `prompts: [PRO-02]` 可选，填写后文章下方会展示对应的提示词卡片和复制按钮。
- `sample: true` 会在页面显示 `SAMPLE` 标记；替换为真实内容后删除该字段或改为 `false`。
- 日期建议保持 `YYYY-MM-DD`。**frontmatter 里的日期、项目周期建议加引号**，避免 YAML 把 `2026.10` 解析成数字 `2026.1`。
- 阅读时间按中日文字符 + 英文单词自动估算。
- 分类数量、标签、归档编号、上下篇、相关笔记、相关提示词和搜索索引都会自动更新。

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

### 当前专注、关于与分类

- `src/data/site.js`：品牌名、简介、角色、GitHub、头像、学习理念。
- `src/data/focus.js`：关于页的当前学习目标，手动维护。
- `src/data/taxonomy.js`：档案分类和 Agent 作业类型。

## Claude Code Token 导入

仓库包含一个只读本地日志的导入脚本：

```bash
npm run import:claude -- --dry-run   # 只统计，不写文件
npm run import:claude                # 写入 usage.json（默认也生成本地笔记模板）
```

默认读取 `~/.claude/projects/**/*.jsonl`，也支持：

```bash
node scripts/import-claude-usage.mjs \
  --source "/path/to/.claude/projects" \
  --out src/data/usage.json \
  --notes-dir src/content/sessions \
  --notes-limit 0 \
  --project home \
  --dry-run
```

聚合规则：

- 按 `sessionId` 合并同一会话的多个 JSONL 文件，并按 message id 去重。
- `tokensIn` = 未缓存的 input tokens。
- `tokensOut` = output tokens。
- `cacheRead` / `cacheWrite` 单列；总量包含全部四项。
- 会话时间使用本机时区日期；模型取该会话出现次数最多的非 synthetic 模型。
- **不写入任何用户 prompt、assistant 回复或原始对话内容。**
- 会保留已有的本地 Markdown 笔记文件，不覆盖（站点不展示这些文件）。
- `usage.json` 中 `demo` 会改为 `false`，页面显示 `LOCAL LOGS`。

当前导入结果：20 个有效会话，约 981.62M processed tokens，其中约 98.4% 为 cache read。这个数字是**包含缓存读取的总处理量**，不是单次 API 的新内容量；页面把 NEW INPUT / OUTPUT / CACHE READ / CACHE WRITE 分开显示。

Qoder / Trae 没有同等可用的本地日志，目前需要手动追加记录：

```json
{
  "date": "2026-10-26",
  "agent": "qoder",
  "task": "接口联调",
  "type": "debug",
  "tokensIn": 120000,
  "tokensOut": 30000,
  "cacheRead": 0,
  "cacheWrite": 0,
  "manual": true
}
```

`manual: true` 的记录在再次运行导入时会被保留。当前 `usage.json` 的顶层字段：

```json
{
  "demo": false,
  "source": "claude-code-logs",
  "updated": "2026-10-26",
  "note": "由本地 Claude Code 会话日志聚合，不包含对话原文……",
  "records": []
}
```

### 本地会话笔记文件（站点不展示）

导入脚本默认会在 `src/content/sessions/` 为每个有效会话生成 Markdown 占位文件，作为本地参考。站点不读取、不展示、不搜索这些笔记，也没有笔记详情页。不需要时，运行导入器加 `--no-notes`，或直接删除该目录。

### 技能与提示词

- Skill：`src/content/posts/skill-*.md` 现有 14 条，`/categories/skill` 分成两组：
  - **自制 Skill（3 条）**：`frontend-ui-design`、`fullstack-dev-workflow`、`web-test-pro`，已导入真实 `SKILL.md` 主体；文章顶部有 GitHub 源码入口，完整目录在仓库的 `myskill/<name>/` 下。
  - **常用 Skill（非自制，11 条）**：`superpowers`（一条总览，整理 7 个常用子技能）、`frontend-design`、`ui-ux-pro-max`（ui-max）、`ui-styling`、`design-system`、`banner-design`、`brand`、`design`、`slides`、`webapp-testing`、常用 Skills 合集。
  - Skill 文章只说明能做什么、怎么用，不展示来源、安装位置或调用日志。
- `myskill/` 存放本地技能源码；站点构建不会打包它，GitHub 目录链接指向仓库里的原始文件。`src/content/sessions/` 是个人的本地会话笔记目录，默认不提交。
- 提示词：`src/data/prompts.js` 保存模板，文章 frontmatter 用 `prompts: [PRO-02]` 引用，展示在文章正文下方，并可通过全局搜索跳转到 `#PRO-xx`；没有独立的提示词页面。
- 前端 / 后端提示词分类各自对应一篇模板文章（`frontend-prompt-*`、`backend-prompt-*`），目前是个人模板，不是本地 SKILL.md 原文。

## 主题

- 页面底色放在 `html` 的 `--bg-base`，`body` 透明；所有面板使用带透明度的 Token，让粒子层能透出来。
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

深链接（例如 `/posts/xxx`、`/projects/xxx`）通过构建时复制 `dist/index.html` → `dist/404.html` 兜底。GitHub Pages 会返回 404 状态码但渲染 SPA，分享和直接访问都能正常打开。

## 验收清单

本地已实际执行：

- `npm run build` 无错误。
- 100+ 项浏览器检查：搜索、筛选、目录、代码复制、深浅主题、移动端菜单、360 / 768 / 1440 视口无横向溢出。
- 特效检查：粒子绘制与缓慢动画、光标拖尾、点击涟漪、画布不拦截交互、reduced-motion 下静止、移动端禁用拖尾。
- 进场动画检查：进度条递增、面板展开、加载层移除后才可交互、点击跳过、同 tab 刷新不重复、reduced-motion 直接跳过。
- 真实数据页面检查：20 条会话记录、按 token 类型的 2 个月图表、6 项 Token 统计、Agent / 项目 / 模型筛选、会话时长、移动端布局；首页不渲染其他模块数据，也不显示 note。
- 优化项检查：提示词搜索跳转锚点、真实 SKILL.md 主体、14 条 Skill 档案与搜索、自制/常用分组、自制技能 GitHub 目录链接、辅助文字最小 10px。
- 0 控制台错误、0 失败请求。

## 已知边界

- 纯静态 SPA，页面 SEO 元信息由客户端更新；搜索引擎对正文的收录有限。
- 无登录、评论、后台与真实接口；所有内容通过仓库文件维护。
- Claude Code 的对话原文与原始日志不进入站点；Qoder / Trae 没有自动导入。
- 会话 note 不在站点展示；本地 Markdown 笔记文件仍可由导入器生成，不需要可关闭。
- 5 篇文章仍带 `SAMPLE` 标记；实际项目记录使用真实项目。
- 图片需要自行放入 `public/` 或以可访问 URL 引用；加载失败时有虚线占位样式。
- 本地改动推送前需由仓库所有者确认；远端当前为空。

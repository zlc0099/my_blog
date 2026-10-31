# PERSONAL ARCHIVE · 个人技术学习档案

> 把个人学习记录做成一套持续更新的技术档案。  
> 深色工业科幻视觉 · 中文长文阅读 · 真实 Agent 资源账本 · 个人学习记录。

纯前端静态站点，无后端、无登录、无数据库。文章和项目是仓库里的 Markdown，Agent 模型统计与 Token 数据由本机 Claude Code / Qoder / Trae 数据聚合到 JSON；构建后部署到 GitHub Pages。

- 仓库：<https://github.com/zlc0099/my_blog>
- 线上地址：<https://zlc0099.github.io/my_blog/>（启用 GitHub Pages 后）

## 功能

- **项目介绍首页**：个人简介、站内目录、GitHub 头像；不展示文章、项目、图表等其他模块内容，也不重复介绍技术栈。
- **界面减法**：页头、页脚、首页、档案、文章、关于、项目与 AI LAB 统一减少英文微标签和解释性文案；档案卡片不再显示摘要，文章页不再显示封面说明和英文页脚标签；保留档案编号、封面与工业排版。
- **知识档案**：全文搜索、分类筛选、标签筛选、URL 状态同步、加载更多、空状态。
- **文章详情**：Markdown 渲染、代码高亮与真实复制、自动目录、滚动章节高亮、阅读进度、上下篇、按标签计算的相关笔记、文章下方挂载相关提示词、示例文章标记。
- **项目记录**：确定性 SVG 蓝图封面、项目档案侧栏、技术栈、真实仓库 / 演示链接、关联笔记。
- **AI LAB**：Claude Code / Qoder / Trae 分工档案、真实 Claude Code Token 账本、按 `CACHE READ / NEW INPUT / OUTPUT` 分型的月度图、按消息模型拆分的 Claude 模型面板，以及 Qoder / Trae 的本地模型与会话统计；三者合计 37 个本地会话、12 条模型记录。
- **会话记录**：AI LAB 以表格展示本地 Claude Code 日志聚合出的日期、时长、Agent、项目、类型与 Token；不展示 note、原始对话或详情页。
- **进场动画**：同一个标签页首次整页进入时显示一次进度条加载动画，完成后中央亮线展开、左右面板从中间分开、首页内容淡入；点击或按 Enter / Space 可跳过，刷新同 tab 和内部路由不会重复出现。
- **页面顶部与轮播**：PageHero 中央内容区增加轻量毛玻璃面板，左右留白保持原样；标题与统计上方的空余区域轮播本地动画静帧（当前 7 张，含《幸运星》《凉宫春日》《冰菓》及《明日方舟》《Fate》等，原图保留在 `public/anime/`，页面使用 800×200 WebP 横幅裁切），60 秒淡入淡出、每次进入随机顺序；轮播不叠加文字标签；鼠标移动产生轻微 3D 倾斜、位移和图片放大，但不做悬浮抬升；小于 1100px 隐藏轮播，`prefers-reduced-motion` 下停止切换与视差。图片位于 `public/anime/`，不使用外链。
- **背景与动效**：固定粒子层缓慢漂浮，毛玻璃面板下方还有一层工业动态背景：缓慢漂移的网格与斜线、旋转雷达刻度环、斜向光束、扫描线、HUD 十字标记，以及绿色 / 青色 / 紫色的北极极光光带与轻射线；颜色由深色/浅色主题 Token 切换。主要面板使用半透明毛玻璃（`backdrop-filter` + 轻环境光晕），页头、档案卡片、AI LAB、关于页与项目面板统一为透明表层；鼠标有小拖尾、点击有涟漪微特效（参考 Arknights 官网氛围，原创实现，不使用官方素材）。档案卡片悬浮时抬升、描边高亮、封面轻微缩放并显示顶部扫描线；路由切换使用淡入淡出与轻微位移过渡。`prefers-reduced-motion` 或触屏设备会自动关闭光标特效、进场动画和位移动效，移动端降低毛玻璃模糊强度；不支持 `backdrop-filter` 时自动回退为更不透明的面板。
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
├─ data/              # 站点、分类、Agent、Token、模型统计、提示词
├─ lib/               # 内容加载、Markdown 渲染、搜索索引、Token / Agent 模型聚合、格式化
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

- `category` 必须是 `src/data/taxonomy.js` 中的六个分类之一：`notes`（学习记录）、`skill`（Skill）、`frontend-prompts`（前端提示词）、`backend-prompts`（后端提示词）、`ai-division`（AI 分工）、`musings`（碎碎念）。
- `prompts: [PRO-02]` 可选，填写后文章下方会展示对应的提示词卡片和复制按钮。
- `sample: true` 会在页面显示 `SAMPLE` 标记；替换为真实内容后删除该字段或改为 `false`。
- 日期建议保持 `YYYY-MM-DD`。**frontmatter 里的日期、项目周期建议加引号**，避免 YAML 把 `2026.10` 解析成数字 `2026.1`。
- 阅读时间按中日文字符 + 英文单词自动估算。
- 带配图的文章可以用 `coverImage` 指定图片封面（如 `coverImage: "/musings/haruhi-cover.webp"`），档案卡片和文章页会优先使用图片封面；`coverStyle` 只在没有图片封面时生效。图片放在 `public/` 对应目录，渲染时会自动适配 Vite `BASE_URL`。
- 碎碎念文章页在分类标签下方显示免责声明；碎碎念分类页和 `#musings` 标签页的「碎碎念」标题旁，以及档案页筛选碎碎念时的分类标签旁，会显示“提示”：“个人主观观点，不代表任何人，只是平日一些稀奇古怪想法的记录。”
- Markdown 站内图片使用根路径（如 `/musings/la-haine-collage.webp`），文件放在 `public/` 对应目录；渲染时会自动拼接 Vite `BASE_URL`，本地和 GitHub Pages 子路径都能加载。
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
- 会话时间使用本机时区日期；会话的 `model` 取该会话出现次数最多的非 synthetic 模型，同时按每条 assistant 消息的 `model` 聚合出 `models` 顶层数组，保留同一会话内的多模型使用情况。
- **不写入任何用户 prompt、assistant 回复或原始对话内容。**
- 会保留已有的本地 Markdown 笔记文件，不覆盖（站点不展示这些文件）。
- `usage.json` 中 `demo` 会改为 `false`，页面显示 `LOCAL LOGS`。

当前导入结果：20 个有效会话，约 981.62M processed tokens，其中约 98.4% 为 cache read。这个数字是**包含缓存读取的总处理量**，不是单次 API 的新内容量；页面把 NEW INPUT / OUTPUT / CACHE READ / CACHE WRITE 分开显示。

Qoder / Trae 的本机数据没有 Token 明细；模型与会话统计由下面的导入器自动同步。如需把 Token 计入账本，仍可手动追加记录：

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
  "models": [
    {
      "model": "deepseek-flash",
      "agent": "claude-code",
      "sessions": 18,
      "messages": 9329,
      "tokensIn": 10525895,
      "tokensOut": 4781472,
      "cacheRead": 951752960,
      "cacheWrite": 0,
      "total": 967060327
    }
  ],
  "records": []
}
```

`models` 按 token 总量降序排列；`sessions` 是出现该模型的会话数，同一会话可能被多个模型分别计数，不能相加。当前 5 个模型的合计与 Token 账本一致（981.62M）。

## Qoder / Trae 模型统计导入

Qoder 与 Trae 的本机应用没有保存可用的 Token 明细，但保留了模型和会话活动。仓库包含一个只读本地数据的统计脚本：

```bash
npm run import:agents -- --dry-run   # 只统计，不写文件
npm run import:agents                # 写入 src/data/agent-models.json
```

脚本需要 Node.js 22.5+（使用内置 `node:sqlite`）。默认读取：

- Qoder：`%APPDATA%/com.qodercn.app.*/main.sqlite` 的 `chat_sessions` / `chat_session_messages`。
- Trae：`%APPDATA%/Trae CN/logs/**/renderer.log` 的 `startStream` 事件，以及 `User/globalStorage/state.vscdb` 中的完成缓存。

也支持显式路径：

```bash
node scripts/import-agent-models.mjs \
  --qoder-db "/path/to/main.sqlite" \
  --trae-dir "/path/to/Trae CN" \
  --out src/data/agent-models.json \
  --dry-run
```

统计规则与隐私边界：

- Qoder：按会话读取模型名和 assistant 回复数；模型名是 Qoder 本地内部标识（如 `dfmodel` / `qfmodel` / `auto`）。
- Trae：从日志的 `startStream` 事件按 `sessionId + userMessageId` 去重，统计模型调用；完成缓存只补充没有被日志覆盖的会话。
- 不写入 Token 估算值；Qoder 与 Trae 不进入 Token 账本、模型 Token 占比和月度图。
- **只输出模型名、会话数、活动数与日期范围；不输出对话、标题、工作区路径、会话 ID。**
- 某个来源暂时读不到时，保留 `agent-models.json` 中已有的对应条目。

当前统计：

- Qoder：9 个会话 / 294 条 assistant 回复 / 3 个模型记录（`dfmodel` 7、`qfmodel` 1、`auto` 1），2026-10-12 → 2026-10-26。
- Trae：8 个会话 / 15 次可观测调用 / 4 个模型记录（`Doubao-Seed-Code` 4、`glm-5.3-flash` 2、`deepseek-v4.1-flash` 2、`qwen3.8-flash` 1），2026-08-19 → 2026-10-26。
- AI LAB 合计展示 37 个本地会话与 12 条模型记录；其中 20 个会话、5 个模型来自 Claude Code Token 日志。

`agent-models.json` 的顶层字段：

```json
{
  "demo": false,
  "source": "local-agent-trace",
  "updated": "2026-10-26",
  "note": "只包含模型名、会话数、活动数与日期范围……",
  "agents": [
    {
      "agent": "qoder",
      "sourceLabel": "LOCAL DB",
      "tokensAvailable": false,
      "activityLabel": "REPLIES",
      "sessions": 9,
      "activity": 294,
      "period": { "first": "2026-10-12", "last": "2026-10-26" },
      "models": [
        { "model": "dfmodel", "sessions": 7, "activity": 278, "first": "2026-10-15", "last": "2026-10-26" }
      ]
    }
  ]
}
```

### 本地会话笔记文件（站点不展示）

导入脚本默认会在 `src/content/sessions/` 为每个有效会话生成 Markdown 占位文件，作为本地参考。站点不读取、不展示、不搜索这些笔记，也没有笔记详情页。不需要时，运行导入器加 `--no-notes`，或直接删除该目录。

### 技能与提示词

- Skill：`src/content/posts/skill-*.md` 现有 16 条，`/categories/skill` 分成两组：
  - **自制 Skill（5 条）**：`frontend-ui-design`、`fullstack-dev-workflow`、`web-test-pro`、`backend-workflow`、`business-story-simulator`，文章正文整理自真实 SKILL.md 与参考文档；文章顶部有 GitHub 源码入口，完整目录在仓库的 `myskill/<name>/` 下。`business-story-simulator` 是开发前业务梳理与项目规划 Skill，区分小白/开发者两种用户模式，开发者模式再按轻量/标准/深度分析，输出需求基线、业务故事、规则追溯和开发工单。
  - **常用 Skill（非自制，11 条）**：`superpowers`（一条总览，整理 7 个常用子技能）、`frontend-design`、`ui-ux-pro-max`（ui-max）、`ui-styling`、`design-system`、`banner-design`、`brand`、`design`、`slides`、`webapp-testing`、常用 Skills 合集。
  - Skill 文章只说明能做什么、怎么用，不展示来源、安装位置或调用日志。
- `myskill/` 存放本地技能源码；站点构建不会打包它，GitHub 目录链接指向仓库里的原始文件。`src/content/sessions/` 是个人的本地会话笔记目录，默认不提交。
- 提示词：`src/data/prompts.js` 保存模板，文章 frontmatter 用 `prompts: [PRO-02]` 引用，展示在文章正文下方，并可通过全局搜索跳转到 `#PRO-xx`；没有独立的提示词页面。
- 前端提示词分类现有 17 篇文章：14 篇站点 / 排版风格 + 3 篇通用开发提示词。14 篇风格文章为政务蓝中后台、深色侧栏生产级中后台、公共服务门户、黑金 / 科技蓝数据大屏、视觉小说 ADV、双主题档案、战术终端、漫画气泡小工具、千禧年代网页（Y2K Retro Web）、主流电影网站、主流二次元游戏官网、后台管理系统排版规范、工业数字化平台门户与后台、百科 Wiki 条目站。每篇只讲按钮、字阶、色彩、间距、表面和状态，不锁页面栏目，也不出现项目名；政务蓝、深色侧栏、黑金大屏、视觉小说、Y2K、电影网站、二次元游戏官网、后台排版、工业平台和 Wiki 十篇把完整设计规范直接放在正文 `prompt` 代码块，其余 4 篇文末挂 `PRO-08`、`PRO-11`–`PRO-13` 的提示词卡片。
- 3 篇通用开发提示词为 `frontend-prompt-vue-page`（Vue 页面实现）、`frontend-prompt-mobile-h5`（Vue H5 移动端 UI 设计与开发）和 `frontend-prompt-saas`（SaaS 系统前端设计与开发）。移动端文章包含项目分析、信息架构、四种视觉方向、安全区/触控/软键盘、页面参考、Vue 组件规范、状态与接口、五阶段执行和验收清单，并配有 `MobileH5Cover.vue` 双手机抽象封面；Wiki 文章包含三栏条目布局、信息框、表格、剧透折叠、内链预览、版本 Tab、深色模式、无障碍与 Agent 输出约束，配有 `WikiCover.vue` 条目页抽象封面；SaaS 文章覆盖项目审查、Design Tokens、布局与七类核心页面、多租户与权限边界、接口契约、六阶段执行和交付验收，配有 `SaasCover.vue` 控制台抽象封面（侧栏、租户切换、指标、图表、表格与套餐配额）。
- 14 篇风格文章、移动端 H5、Wiki 和 SaaS 文章共 16 篇用 frontmatter 的 `coverStyle` 渲染 CSS 封面示意；`/posts`、分类和标签页使用封面卡片网格（桌面 3 列、平板 2 列、手机 1 列），没有封面的文章使用按分类和档案编号生成的默认封面。
- 档案列表按 9 条/页分页，只渲染当前页；分页控件在列表底部，页码写入 URL 的 `?page=`，筛选、搜索或切换分类/标签会回到第 1 页。Skill 页也按 9 条/页分页，并保留自制/常用分组。
- 后端提示词分类现有 5 篇文章：`backend-prompt-spring-boot` 是 Spring Boot 功能实现模板，文末挂 `PRO-02`；`backend-prompt-requirements-planning` 是初期需求分析与项目工单编制；`backend-prompt-full-chain-testing` 是全链路测试与业务闭环验证；`backend-prompt-batch-fix` 是测试报告后的缺陷分析与分批修复；`backend-prompt-performance-testing` 是性能测试与 P0–P3 优化分析。后四篇正文包含完整规范（`prompts: []`），形成需求 → 开发 → 测试 → 性能 → 修复的阶段链。

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
- 动效检查：档案卡片悬浮抬升 / 顶部扫描线 / 封面缩放 / 键盘 focus 同步，移出后复位；路由切换淡入淡出、分页查询不触发整页过渡、跨页 `#PRO-xx` 锚点在过渡完成后正确滚动；reduced-motion 下位移动画关闭。
- 毛玻璃检查：桌面主要面板为 `rgba` 半透明 + 18px `backdrop-filter`，移动端自动降为 12px；深色 / 浅色主题、搜索浮层、归档卡片、关于页档案卡、AI LAB 面板和项目卡片均生效；无 `backdrop-filter` 支持时回退为高不透明背景，页面无横向溢出。
- PageHero 检查：中央毛玻璃面板不影响左右留白；轮播使用本地图片，60 秒淡入淡出并随机排序，不叠加文字；鼠标移动只产生倾斜/位移/放大，不触发悬浮抬升；1100px 以下隐藏轮播，reduced-motion 停止轮播与视差。
- 工业背景检查：网格、斜线、雷达刻度、光束和扫描线持续缓慢运动；极光采用轻量渐变光带（不使用大面积 blur / clip-path 动画），深色模式呈绿/青/紫，浅色模式呈柔和薄荷/蓝紫；主题切换后颜色变量更新，`prefers-reduced-motion` 下所有背景动画停止，移动端隐藏第三层极光与射线。
- 真实数据页面检查：20 条 Claude Code 会话记录、按 token 类型的 2 个月图表、6 项 Token 统计、5 个模型的拆分面板（合计 981.62M）、Qoder / Trae 的 17 个会话与 7 条模型记录、37 个 Agent 会话 / 12 条模型记录的汇总、Agent / 项目 / 模型筛选（模型筛选覆盖会话内多模型）、会话时长、移动端布局；首页不渲染其他模块数据，也不显示 note。
- 优化项检查：提示词搜索跳转锚点、真实 SKILL.md 主体、16 条 Skill 档案与搜索、自制/常用分组、自制技能 GitHub 目录链接、辅助文字最小 10px。
- 0 控制台错误、0 失败请求。

## 已知边界

- 纯静态 SPA，页面 SEO 元信息由客户端更新；搜索引擎对正文的收录有限。
- 无登录、评论、后台与真实接口；所有内容通过仓库文件维护。
- Claude Code 的对话原文与原始日志不进入站点；Qoder 的会话标题、工作区路径与 Trae 的对话内容也不会导出。Qoder / Trae 只同步模型、会话和活动数，不包含 Token 明细。
- 会话 note 不在站点展示；本地 Markdown 笔记文件仍可由导入器生成，不需要可关闭。
- 5 篇文章仍带 `SAMPLE` 标记；实际项目记录使用真实项目。
- 图片需要自行放入 `public/` 或以可访问 URL 引用；加载失败时有虚线占位样式。
- 本地改动推送前需由仓库所有者确认；远端当前为空。

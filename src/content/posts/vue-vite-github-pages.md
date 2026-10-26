---
title: Vue 3 + Vite 静态博客：GitHub Pages 上线的工程清单
slug: vue-vite-github-pages
date: 2026-10-26
updated: 2026-10-26
category: notes
tags: [vue, vite, github-pages, frontend]
prompts: [PRO-01, PRO-03]
summary: 用 Vue 3 + Vite 搭一个无后端的技术档案站：Markdown 内容管线、base 路径、深链接兜底、主题持久化和构建体积控制。
featured: false
sample: true
---

这个站点本身也是一次工程实践。目标很明确：纯静态、可长期维护、能部署到 GitHub Pages，同时支持文章检索、目录、代码复制和深浅主题。下面是实际用到的工程决策。

## 为什么是 Vue 3 + Vite

内容型站点当然可以用更偏静态的方案，但这个博客有大量交互：筛选、搜索浮层、目录滚动高亮、复制反馈和主题切换。Vue 3 的组件模型和现有的使用习惯更匹配，Vite 的构建速度和 Markdown 热更新也足够顺畅。

依赖保持在最小范围：

- `vue` / `vue-router`：页面与路由。
- `markdown-it` / `markdown-it-anchor`：正文渲染与标题锚点。
- `highlight.js`：只注册实际使用的语言。
- `js-yaml`：解析 frontmatter。
- `github-slugger`：生成稳定且去重的标题 ID。

没有 UI 库、CSS 框架、图表库和状态管理库。

## base 路径不能写死

项目部署在 `https://zlc0099.github.io/my_blog/` 这样的子路径下。如果构建配置里写死 `/`，部署后所有静态资源都会 404。

```js vite.config.js
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = process.env.BASE_PATH
  ?? (repository && !repository.endsWith('.github.io') ? `/${repository}/` : '/');

export default defineConfig({
  base,
  plugins: [vue()],
});
```

GitHub Actions 会自动提供 `GITHUB_REPOSITORY`，仓库改名后不需要再手动同步配置。本地开发时 base 为 `/`，保持正常的开发体验。

## history 模式的深链接兜底

GitHub Pages 是纯静态托管，直接访问 `/posts/xxx` 会返回 404。最常见的解决方式是在构建完成后，把 `index.html` 复制为 `404.html`：

```bash 部署步骤
npm run build
cp dist/index.html dist/404.html
```

这样直接打开深链接时，GitHub Pages 返回的 404 页面实际上是单页应用入口，路由接管后渲染正确内容。代价是响应状态码仍然是 404，对 SEO 不理想，但对个人站点的分享访问足够。

也可以选择 hash 路由彻底规避这个问题，但 URL 会变成 `/#/posts/xxx`。这次优先保留干净的路径。

## Markdown 内容管线

文章放在 `src/content/posts/`，通过 Vite 的 `import.meta.glob` 在构建时收集：

```js main-content.js
const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```

文件名和 frontmatter 提供 slug、日期、分类、标签与摘要。阅读时间按中文字符数和英文单词数估算，上下篇与相关文章都由数据计算，不需要手动维护索引。

代码块在渲染阶段经过一次转换，输出带语言标签、复制按钮和可横向滚动的结构。复制按钮使用事件代理，避免给每个代码块单独绑定监听器。

## 主题与首屏闪烁

主题状态保存在 `localStorage`，并在 `index.html` 的 `<head>` 里用一段很早执行的脚本恢复，避免页面先渲染深色再闪成浅色。

浅色主题不是简单反转颜色，而是单独定义一套“纸张档案”色板：暖白背景、石墨文字、相同的橙色强调。代码块在两套主题下都保持深色，减少阅读时的视觉跳变。

## 性能上的取舍

几个直接影响构建体积的选择：

1. 拉丁字体自托管，只引入实际使用的字重；中文使用系统字体栈，避免多兆字节的中文字体包。
2. 代码高亮只注册 Java、SQL、JavaScript、YAML 等实际用到的语言。
3. 文章详情页、AI LAB 等路由按需加载。
4. 图表使用原生 CSS/SVG，不引入图表库。
5. 搜索索引在本地构建，不依赖外部搜索服务。

对于一个内容规模不大的个人站点，这些措施比微调首屏动画更重要。

## 验收清单

上线前实际执行的检查：

- [x] `npm run build` 无错误。
- [x] 首页、文章、分类、标签、项目之间可以正常跳转。
- [x] 搜索与筛选真实生效，清除筛选后恢复全部。
- [x] 目录自动生成，滚动时高亮当前章节。
- [x] 代码复制成功与失败都有反馈。
- [x] 深色 / 浅色主题覆盖所有组件。
- [x] 360px、768px、1280px 三档视口无横向溢出。
- [x] 控制台无报错。

## 复盘

静态博客的难点不在页面，而在内容维护路径是否足够短。现在新增一篇文章只需要放一个 Markdown 文件，分类、标签、时间线和搜索会自动更新。下一步是把 token 账本的真实导入流程补上，减少手动维护成本。

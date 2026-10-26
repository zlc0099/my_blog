---
title: Skill：前端 UI 设计规范
slug: skill-frontend-ui-design
date: 2026-10-20
updated: 2026-10-20
category: skill
skillType: "self"
repoPath: "myskill/frontend-ui-design"
tags: [skill, frontend, design-system, accessibility]
summary: 把颜色、字体、间距、组件和可访问性规则固化成一套可执行的 UI 规范，避免每个页面各写一套样式。
prompts: []
---

> 以下内容来自本地技能项目 `frontend-ui-design/SKILL.md`（已移除 frontmatter 与技能标题）。技能还包含 `references/` 目录和脚本，站点只导入了 SKILL.md 主体。

## 调用方式（通用适配）

- **手动调用**：本技能不依赖自动触发。当用户显式引用本技能（如 `/frontend-ui-design`、"用 frontend-ui-design 规范"、"按 UI 设计规范来"）时，Agent 读取本 SKILL.md 并按其执行。
- **跨 Agent 兼容**：本技能只使用 Markdown、相对路径引用与标准 CSS，不依赖任何特定平台的工具或 API。任何能读取本目录文件的 Agent 均可使用：
  - 支持 SKILL.md frontmatter 的 Agent（Claude Code / Cursor / Codex 等）：自动识别 name/description，按下方工作流执行。
  - 不支持技能机制的 Agent：将本文件及 references/ 内容作为系统提示或上下文注入即可。
- **引用规则**：文中所有 `references/...` 与 `assets/...` 均为相对于本 SKILL.md 所在目录的路径，按需读取对应文件。

## 目的

确保生成的前端代码产出**视觉统一、现代美观、可用性好**的界面。本技能提供一套可执行的设计决策规则：所有样式决策（颜色、字号、间距、圆角、动效）必须来自统一的 Design Token 体系，禁止随意取值。

## 适用场景（调用后对以下任务生效）

- 从零生成网页 / Web 应用 / 组件库 / 落地页 / Dashboard
- 美化或重构已有页面的样式
- 用户要求"更有设计感"、"更现代"、"更好看"时
- 用户提供了品牌色 / 参考站点，需要落地为规范时

## 工作流程

1. **确定风格关键词**：从需求中提取风格定位（如：专业稳重 / 年轻活泼 / 极简高级 / 科技感）。有品牌色则以其为 Primary，无则按 `references/visual-style.md` 的预设配色方案选择。
2. **建立 Design Tokens**：复制 `assets/design-tokens.css` 到项目，按风格调整 `--color-primary`、字体与圆角档位。所有后续样式**只允许引用 Token**，不允许出现魔法数字。
3. **按需加载参考文档**（渐进式，不必全部读取）：
   - 配色 / 字体 / 间距 / 圆角 / 阴影 → `references/visual-style.md`
   - 页面布局 / 栅格 / 响应式断点 → `references/layout-responsive.md`
   - 按钮 / 表单 / 卡片 / 导航等组件写法 → `references/components.md`
   - 过渡 / 微动效 / 加载反馈 → `references/motion.md`
   - 对比度 / 焦点 / 键盘 / 语义化 → `references/accessibility.md`
4. **写代码**：遵循下方"核心铁律"与对应参考文档中的规则与示例。
5. **交付前自检**：逐条过一遍文末"自检清单"，不满足的项修复后再交付。

## 核心铁律（任何项目不可违反）

1. **Token 优先**：颜色、字号、间距、圆角、阴影、动效时长一律使用 CSS 变量，不写魔法数字。
2. **8px 网格**：所有间距取 4 的倍数（4/8/12/16/24/32/48/64），主间距档为 8。
3. **对比度达标**：正文文字对比度 ≥ 4.5:1，大字号（≥24px 或 ≥18.66px 粗体）≥ 3:1。
4. **状态齐全**：交互元素必须有 hover / focus-visible / active / disabled 四态样式；focus 态必须有可见焦点环，禁止 `outline: none` 裸删。
5. **动效克制**：150–300ms、单一缓动函数（推荐 `cubic-bezier(0.4, 0, 0.2, 1)`）、只动 `transform` 与 `opacity`；全局提供 `prefers-reduced-motion` 降级。
6. **移动优先**：先写移动端布局，用 `min-width` 媒体查询逐级增强；触控目标 ≥ 44×44px。
7. **留白优于分割线**：用间距和层级区分内容，少用边框；卡片阴影克制（一层柔和阴影即可）。
8. **一套字体、两级字阶**：正文字号 14–16px，行高 1.5–1.75；标题至少与正文形成 1.5 倍字号差。

## 参考文档索引

| 场景 | 文件 |
| --- | --- |
| 选配色方案、定字体栈、间距/圆角/阴影档位 | `references/visual-style.md` |
| 栅格、容器宽度、断点、响应式模式 | `references/layout-responsive.md` |
| 各组件（按钮/表单/卡片/导航/表格/弹层）的完整规则与代码示例 | `references/components.md` |
| 过渡动效、微交互、骨架屏、reduced-motion | `references/motion.md` |
| WCAG 对比度、焦点管理、键盘、ARIA | `references/accessibility.md` |
| 开箱即用的 CSS 变量文件（直接复制进项目） | `assets/design-tokens.css` |

## 交付前自检清单

- [ ] 所有取值来自 Token，无魔法数字
- [ ] 页面在 360px / 768px / 1280px 宽度下均无横向滚动、无内容截断
- [ ] 所有可交互元素四态齐全，键盘 Tab 可达且焦点环可见
- [ ] 正文与背景对比度 ≥ 4.5:1（用工具或 `references/accessibility.md` 的方法验证）
- [ ] 触控目标 ≥ 44×44px
- [ ] 动效只使用 transform/opacity，且 reduced-motion 下自动关闭
- [ ] 空状态 / 加载态 / 错误态有处理（骨架屏或占位文案）
- [ ] 深浅色模式（如实现）下均通过对比度检查

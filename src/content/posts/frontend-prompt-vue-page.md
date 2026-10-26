---
title: 前端提示词：Vue 3 页面实现
slug: frontend-prompt-vue-page
date: 2026-10-23
updated: 2026-10-23
category: frontend-prompts
tags: [prompt, frontend, vue, design-system]
summary: 写 Vue 3 页面时用的一份提示词：先列组件和状态，再明确响应式、空状态、真实交互和验收清单。
prompts: [PRO-03]
sample: true
---

这是我写 Vue 页面时常用的一份提示词，重点是让 Agent 先说明结构和状态，再动手写。

## 使用场景

新页面、已有页面的组件拆分、交互补齐，或者把设计稿落成可运行的 Vue 组件时使用。

## 我会在提示词里强调

- 沿用项目已有的 Design Token，不自己造颜色和圆角。
- 先说明组件拆分和状态来源，再开始写代码。
- 桌面、平板、手机三档都要有布局说明。
- loading、empty、error、success 四种状态不能漏。
- 筛选、搜索、复制、跳转这些交互必须真的可用，不能只做外观。
- 最后给出可执行的验收清单。

实际提示词在文章下方，使用前把变量替换成当前项目的上下文。

> 这是一份个人模板，不是完整 SKILL.md 原文；更适合当作讨论和实现的起点，而不是直接复制上线。

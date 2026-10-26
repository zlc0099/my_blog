---
title: "Skill：webapp-testing"
slug: "skill-webapp-testing"
date: "2026-10-16"
updated: "2026-10-26"
category: "skill"
skillType: "common"
tags: ["skill", "testing", "playwright", "qoder"]
prompts: []
summary: "Qoder 侧的本地 Web 测试技能：用 Playwright 跑真实交互、截图、控制台和网络检查。"
---

> 来源：Qoder 本地技能 `~/.qoder-cn/skills/webapp-testing`；`skills-main` 里也有一份同名集合版本。

## 用途

用 Playwright 操作和测试本地 Web 应用，覆盖页面交互、浏览器日志、截图和回归验证。

## 主要能力

- 打开本地页面并执行真实交互
- 捕获控制台和网络请求
- 多视口截图
- 编写带断言的 Playwright 测试脚本
- 配合 `with_server.py` 管理本地服务

## 使用方式

在 Qoder 里显式调用，针对本地开发地址写 Playwright 脚本。测试结果以真实浏览器行为和截图为准，不只看代码。

> 这个技能的调用记录在 Qoder 侧，Claude Code 日志不包含它。站点只记录用途和结构。

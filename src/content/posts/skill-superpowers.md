---
title: "Skill：superpowers 工作流合集"
slug: "skill-superpowers"
date: "2026-10-01"
updated: "2026-10-26"
category: "skill"
skillType: "common"
tags: ["skill", "superpowers", "workflow", "tdd", "debugging"]
prompts: []
summary: "一套面向多步开发任务的工作流 Skill：从澄清、计划、TDD 到排障和收尾。"
---

## 常用子技能

- `writing-plans`：把需求拆成可执行的多步计划。
- `brainstorming`：先澄清意图、需求和设计方向。
- `test-driven-development`：先写测试，再实现功能或修 Bug。
- `executing-plans`：在当前会话按计划逐项执行。
- `finishing-a-development-branch`：处理完成后的分支、测试和集成。
- `subagent-driven-development`：按任务派发子代理并逐项复核。
- `systematic-debugging`：按复现、假设、验证的顺序排查问题。

## 我通常怎么串起来用

1. 用 `brainstorming` 把模糊想法问清楚。
2. 用 `writing-plans` 生成可执行的分步计划。
3. 用 `executing-plans` 或 `subagent-driven-development` 实施。
4. 需要写代码时走 `test-driven-development`。
5. 出问题先走 `systematic-debugging`，不直接猜修复。
6. 最后用 `finishing-a-development-branch` 做收尾和合并判断。

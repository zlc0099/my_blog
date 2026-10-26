---
title: "Skill：superpowers 工作流合集"
slug: "skill-superpowers"
date: "2026-10-01"
updated: "2026-10-26"
category: "skill"
skillType: "common"
tags: ["skill", "superpowers", "workflow", "tdd", "debugging"]
prompts: []
summary: "Claude Code 里实际调用最多的一套工作流技能：从 brainstorming、写计划、TDD 到排障、收尾和分支处理。"
---

> 来源：Claude Code 插件 `superpowers@claude-plugins-official` v6.4.1，安装于 2026-10-01。这是一条总览，不是把插件的 15 个子技能全部展开。

## 实际调用记录

本机 Claude Code 的 85 个会话日志里，`Skill` 工具共记录到 21 次 superpowers 调用：

| 子技能 | 次数 | 主要用途 |
| --- | ---: | --- |
| `writing-plans` | 5 | 在动代码前把多步任务拆成计划 |
| `brainstorming` | 4 | 先澄清需求和设计方向 |
| `test-driven-development` | 3 | 先写测试再实现功能或修 Bug |
| `executing-plans` | 3 | 在当前会话按计划逐项执行 |
| `finishing-a-development-branch` | 3 | 完成后处理分支、测试和集成 |
| `subagent-driven-development` | 2 | 按任务派发子代理并逐项复核 |
| `systematic-debugging` | 1 | 遇到 Bug 时按复现、假设、验证排查 |

## 我通常怎么串起来用

1. 用 `brainstorming` 把模糊想法问清楚。
2. 用 `writing-plans` 生成可执行的分步计划。
3. 用 `executing-plans` 或 `subagent-driven-development` 实施。
4. 需要写代码时走 `test-driven-development`。
5. 出问题先走 `systematic-debugging`，不直接猜修复。
6. 最后用 `finishing-a-development-branch` 做收尾和合并判断。

## 插件里还有、但日志里没有直接调用

`requesting-code-review`、`receiving-code-review`、`verification-before-completion`、`using-git-worktrees`、`writing-skills`、`using-superpowers`、`diagnosing-superpowers`、`dispatching-parallel-agents`。

> 统计来自 Claude Code 本机会话日志，不包含 Qoder / Trae；如果后续用到其他子技能，记录会再更新。

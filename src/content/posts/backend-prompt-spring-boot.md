---
title: 后端提示词：Spring Boot 功能实现
slug: backend-prompt-spring-boot
date: 2026-10-22
updated: 2026-10-22
category: backend-prompts
tags: [prompt, backend, spring-boot, api]
summary: 在已有 Spring Boot 分层结构里改功能时用的提示词：先列文件和影响范围，再处理校验、事务、SQL 和测试。
prompts: [PRO-02]
sample: true
---

这是我在 Spring Boot 项目里改接口时常用的一份提示词，主要用来约束改动范围。

## 使用场景

新增或修改接口、调整业务规则、补参数校验、修改数据访问逻辑，或需要评估表结构和索引影响时使用。

## 我会在提示词里强调

- 先列改动文件清单和影响范围，避免顺手改无关模块。
- DTO / VO 分离，参数校验和异常映射写清楚。
- 事务边界放在 Service，Controller 不写业务逻辑。
- 给出 SQL 方案并说明索引影响。
- 补充单元测试和接口测试的回归范围。
- 输出可以直接应用的 diff，不省略关键代码。

实际提示词在文章下方，使用前把需求、表结构和现有代码约定补进去。

> 这是一份个人模板，不是完整 SKILL.md 原文。

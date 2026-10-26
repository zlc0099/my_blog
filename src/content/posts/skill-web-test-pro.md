---
title: Skill：Web 页面测试与体检
slug: skill-web-test-pro
date: 2026-10-21
updated: 2026-10-21
category: skill
skillType: "self"
repoPath: "myskill/web-test-pro"
tags: [skill, testing, playwright, accessibility]
summary: 在 Playwright 基础上补一层页面体检：JS 异常、失败请求、可访问性、多视口截图和性能指标一次跑完。
prompts: []
---

## 调用方式（通用适配）

- **手动调用**：本技能不依赖自动触发，普通"测试一下"类请求不加载本技能。仅当用户显式引用本技能（`/web-test-pro`、"按 web-test-pro 测试"）时，读取本 SKILL.md 并执行。
- **跨 Agent 兼容**：仅依赖 Python + Playwright 与标准库，无平台特有 API。任何能读取本目录的 Agent 均可使用；不支持技能机制的 Agent 将本文件作为上下文注入即可。
- **脚本黑盒原则**：所有脚本先用 `--help` 查看用法再调用，**不要**直接阅读脚本源码（除非定制确有必要），避免污染上下文。

## 相对官方 webapp-testing 的增强点

| 能力 | 官方版 | 本技能 |
| --- | --- | --- |
| 测试判定 | 无（仅自动化操作） | ✅ check() 断言 + PASS/FAIL 汇总 + exit code（CI 可用） |
| 网络层错误 | 仅 console | ✅ + 未捕获 JS 异常、失败请求、HTTP ≥400 |
| 页面体检 | 需现写脚本 | ✅ `quick_audit.py` 一键完成 7 类检查 |
| 可访问性 | 无 | ✅ img alt / label / lang / 可访问名称快检 |
| 响应式 | 无 | ✅ 多视口截图 + 横向滚动检测 |
| 性能 | 无 | ✅ DOMContentLoaded / Load 耗时采集 |
| 报告 | 无 | ✅ JSON + Markdown 报告模板 |
| 环境自检 | 无 | ✅ `env_check.py` 精确定位缺什么、怎么装 |
| 服务器管理 | 端口探测、PIPE 阻塞风险 | ✅ HTTP 健康检查 + 日志文件 + 并行启动 |

## 工具索引

| 脚本 | 用途 | 典型命令 |
| --- | --- | --- |
| `scripts/env_check.py` | 环境自检与安装引导 | `python scripts/env_check.py` |
| `scripts/quick_audit.py` | 一键页面体检（7 类检查 → JSON + 报告 + 截图） | `python scripts/quick_audit.py <url> --out ./audit-result` |
| `scripts/screenshot.py` | 多视口截图 | `python scripts/screenshot.py <url> --widths 360,768,1280 --full-page` |
| `scripts/with_server.py` | 服务器生命周期管理（支持多服务 + HTTP 健康检查） | `python scripts/with_server.py --server "npm run dev" --port 5173 -- python test.py` |

## 决策树

```
用户任务 → 环境就绪？
    ├─ 不确定/首次使用 → python scripts/env_check.py，按提示修复
    │
    └─ 就绪 → 用户要什么？
        ├─ "检查页面有没有问题 / 体检 / 验收"（通用快检）
        │    └─ 服务未启动 → with_server.py 包裹
        │       → python scripts/quick_audit.py <url> --out ./audit-result
        │       → 依据 report.md 给结论；exit 1 时先报告阻断问题
        │
        ├─ "测试某个具体功能"（登录/表单/CRUD/导航…）
        │    → 查 references/playbook.md 对应场景
        │    → 按"通用脚本骨架"写定向 Playwright 脚本（含 check 断言）
        │    → 静态 HTML 直接 file:// 打开；动态应用用 with_server.py
        │
        └─ "看看各端长什么样 / 留证"（截图）
             └─ python scripts/screenshot.py <url> --widths 360,768,1280 --full-page
```

## 标准工作流

1. **环境自检**：`python scripts/env_check.py`；缺 Playwright 则 `pip install playwright && python -m playwright install chromium`。
2. **启动被测应用**：已在运行则直接测；否则用 `with_server.py` 托管（前后端分离时传多个 `--server/--port`，dev server 建议加 `--health-url` 与 `--timeout 120`）。
3. **一键体检**：先跑 `quick_audit.py` 摸底——JS 异常、console 错误、失败请求、HTTP 错误、a11y、横滚、性能一次拿全。
4. **定向测试**：体检通过后，按 `references/playbook.md` 场景手册写定向脚本（必须含 check 断言与 exit code）；选择器先侦察（截图/`page.content()`/`get_by_role` 枚举）再操作。
5. **出报告**：按 `references/report-template.md` 汇总为 Markdown 报告（结论先行、阻断问题附复现步骤与证据路径），连同 JSON 与截图一并交付。

## 定向测试脚本的硬性要求

- 结果必须结构化输出（JSON 汇总 passed/failed 明细）并以退出码表达成败：全过 0，有失败 1。
- 动态页面先 `wait_for_load_state("networkidle")` 再查 DOM（SPA 长轮询例外：改 `wait_for_selector`）。
- 语义选择器优先：`get_by_role` > `get_by_label` > `get_by_text` > CSS；禁止依赖生成式 class。
- 用 `wait_for_selector` 等元素，不用固定 sleep；每个 check 独立，单项失败不阻断全量执行。
- Windows/跨平台：路径用 `pathlib.Path`，禁止硬编码 `/mnt/...` 等沙箱路径。

## 参考文档索引

| 场景 | 文件 |
| --- | --- |
| 功能/表单/响应式/a11y/性能场景手册、验收标准、常见坑 | `references/playbook.md` |
| 测试报告 Markdown 模板 | `references/report-template.md` |

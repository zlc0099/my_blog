---
title: MySQL 慢查询：从执行计划到索引调整
slug: mysql-slow-query-index
date: 2026-10-12
updated: 2026-10-14
category: notes
tags: [mysql, index, performance, explain]
prompts: [PRO-04]
summary: 一个列表接口从 1.8 秒降到 80 毫秒的过程：先读执行计划，再判断索引顺序，最后用覆盖索引减少回表。
featured: false
sample: true
---

慢查询最危险的地方不是慢，而是“看起来只是数据量变大”。如果直接加索引或者调大缓存，很容易掩盖真正的访问模式问题。这次排查完整走了一遍：复现、看执行计划、验证假设、改索引、回归。

## 现象

列表接口在测试环境耗时约 1.8 秒，数据量只有 20 万行。查询条件包含状态、租户和创建时间范围，排序使用创建时间倒序。

```sql bid_list.sql
SELECT id, title, status, created_at
FROM bid
WHERE tenant_id = 42
  AND status IN ('SUBMITTED', 'REVIEWING')
  AND created_at >= '2026-09-01'
ORDER BY created_at DESC
LIMIT 20;
```

表上已经有 `tenant_id` 单列索引和 `created_at` 单列索引，但执行计划里同时出现了全表扫描和 `Using filesort`。

## 先看执行计划

```sql explain.sql
EXPLAIN
SELECT id, title, status, created_at
FROM bid
WHERE tenant_id = 42
  AND status IN ('SUBMITTED', 'REVIEWING')
  AND created_at >= '2026-09-01'
ORDER BY created_at DESC
LIMIT 20;
```

关键信息：

| 字段 | 结果 | 含义 |
| --- | --- | --- |
| `type` | `ALL` | 没有选择合适的索引 |
| `key` | `NULL` | 本次查询未使用索引 |
| `rows` | `198431` | 接近全表扫描 |
| `Extra` | `Using filesort` | 排序需要额外处理 |

优化器在 `tenant_id` 和 `created_at` 之间犹豫，最终认为回表成本过高，选择了全表扫描。这里的问题不是“缺索引”，而是“缺少与查询顺序匹配的联合索引”。

## 索引顺序怎么定

查询的等值条件、范围条件和排序字段需要一起考虑。一个常用的判断顺序是：

1. 等值过滤字段放在联合索引前部。
2. 范围过滤字段通常放在等值字段之后。
3. 排序字段尽量与索引顺序一致，避免额外排序。
4. 如果查询列较少，考虑把查询列也放进索引形成覆盖索引。

针对这条 SQL，索引设计为：

```sql index.sql
ALTER TABLE bid
  ADD INDEX idx_tenant_status_created (tenant_id, status, created_at);
```

这里有一个细节：`status` 使用 `IN`，在索引中仍然可以作为等值条件处理；排序字段 `created_at` 紧跟其后，能让同一个索引同时服务过滤和排序。对于 `created_at` 的范围条件，优化器可以先利用前两列定位，再在范围内按索引顺序读取。

验证结果：

| 指标 | 调整前 | 调整后 |
| --- | --- | --- |
| 执行时间 | 约 1800 ms | 约 80 ms |
| `type` | `ALL` | `range` |
| `rows` | 198431 | 1240 |
| `Extra` | `Using filesort` | `Using index condition` |

## 覆盖索引与回表

列表页只需要 `id`、`title`、`status`、`created_at`。如果业务允许，把 `title` 也加入索引，就能避免回表：

```sql covering-index.sql
ALTER TABLE bid
  ADD INDEX idx_tenant_status_created_cover
    (tenant_id, status, created_at, title);
```

覆盖索引的代价是索引更大、写入更慢。这次没有直接替换原索引，而是先评估了写入频率：这张表以读为主，写入集中在白天，索引维护成本可以接受。最终保留了一个覆盖索引，并删除了原本很少被使用的 `created_at` 单列索引。

> 索引不是越多越好。每加一个索引，都要能说清楚它服务哪条查询、付出多少写入成本。

## 容易踩的坑

- 只看 `type` 不看 `rows`：`range` 也可能扫描大量数据。
- 只给过滤字段加索引，忽略排序字段，最后仍然 `filesort`。
- 把区分度很低的字段放在联合索引最左边，导致索引选择性差。
- 用函数包裹索引列，例如 `DATE(created_at)`，索引直接失效。
- 在测试环境用很小的数据集验证，结果上线后完全不同。

这次排查后，我给列表查询补了一个固定的 `EXPLAIN` 回归用例。数据量变化时，能更早发现执行计划回退。

## 结论

慢查询处理应该先问三个问题：查询模式是什么、现有索引为什么没被选中、修改索引会带来什么写入成本。加索引只是最后一步，不是第一步。

---
title: Spring Boot 分层重构：把业务从 Controller 里拿出来
slug: spring-boot-layered-refactor
date: 2026-10-20
updated: 2026-10-22
category: notes
tags: [spring-boot, architecture, refactor]
prompts: [PRO-02]
summary: 一次从「Controller 直连 Mapper」到 Controller / Service / Mapper 分层的重构记录，包含 DTO 边界、事务归属和回归清单。
featured: true
sample: true
---

这是一次偏工程化的重构：接口本身没有变化，但把校验、业务规则和事务从 Controller 里清理出去。目标不是追求更“高级”的目录结构，而是让下一次改动能在一个明确的边界内完成。

## 背景

最初的实现很直接：Controller 接收请求，拼装查询条件，调用 Mapper，再把实体直接返回给前端。功能上线很快，但当同一个业务规则被第二个入口复用时，问题开始出现。

- Controller 同时承担参数转换、业务判断和数据访问，单个文件超过 400 行。
- 事务注解散落在 Controller 方法上，边界不清晰。
- Entity 直接作为接口返回值，字段变更会影响前端。
- 同一段校验逻辑在两个接口里各写了一遍。

## 重构目标

先明确这次做什么、不做什么：

1. Controller 只负责协议层：接收参数、校验、调用 Service、包装响应。
2. Service 承担业务规则与事务边界。
3. Mapper 只关心数据访问，不写业务分支。
4. 对外返回 VO，不再直接暴露 Entity。
5. 本次不引入新的框架，不改数据库结构。

> 重构的验收标准不是“目录看起来更整齐”，而是新增一个入口时不需要复制业务代码。

## 从 Controller 里搬走什么

重构前，Controller 里同时出现了参数校验和业务状态判断：

```java BidController.java
@PostMapping("/bids")
public BidEntity create(@RequestBody BidEntity entity) {
    if (entity.getDeadline().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("已过截止时间");
    }
    if (entity.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
        throw new RuntimeException("金额必须大于 0");
    }
    entity.setStatus("DRAFT");
    return bidMapper.insert(entity);
}
```

改造后，Controller 只做协议层工作，业务规则进入 Service：

```java BidController.java
@PostMapping("/bids")
public ApiResponse<BidVO> create(@Valid @RequestBody BidCreateDTO dto) {
    BidVO result = bidService.create(dto);
    return ApiResponse.ok(result);
}
```

```java BidService.java
@Transactional
public BidVO create(BidCreateDTO dto) {
    LocalDateTime now = LocalDateTime.now();
    if (dto.getDeadline().isBefore(now)) {
        throw new BizException("BID_DEADLINE_PASSED", "已过截止时间");
    }
    BidEntity entity = bidConverter.toEntity(dto);
    entity.setStatus(BidStatus.DRAFT.name());
    bidMapper.insert(entity);
    return bidConverter.toVO(entity);
}
```

这一步完成后，Controller 从 400 多行降到 90 行左右，业务规则也能被其他入口复用。

## DTO 与 VO 的边界

重构中最容易被低估的是对象转换。直接用 Entity 接参和返回，短期省事，长期会把数据库字段变成接口契约。

| 对象 | 用途 | 是否对外 | 备注 |
| --- | --- | --- | --- |
| `BidCreateDTO` | 创建请求 | 是 | 只包含允许客户端传入的字段 |
| `BidEntity` | 数据库映射 | 否 | 保留审计字段与内部状态 |
| `BidVO` | 接口响应 | 是 | 明确字段类型与展示结构 |
| `BidQuery` | 查询条件 | 否 | 收敛分页、排序与筛选 |

转换逻辑集中到一个 Converter 中，避免在 Controller 和 Service 里各写一遍。字段新增时先问一句：这是数据库需要，还是接口需要？两者经常不是同一件事。

### 事务应该放在哪里

事务注解放在 Service 的公共方法上，确保一次业务操作只跨越一个明确边界。Controller 不开启事务，Mapper 不自行提交。

```java BidService.java
@Transactional(rollbackFor = Exception.class)
public void submit(Long bidId, Long operatorId) {
    BidEntity bid = bidMapper.selectById(bidId);
    if (bid == null) {
        throw new BizException("BID_NOT_FOUND", "记录不存在");
    }
    bidStatusMachine.assertCanSubmit(bid.getStatus());
    bidMapper.updateStatus(bidId, BidStatus.SUBMITTED.name());
    auditService.record(bidId, operatorId, "SUBMIT");
}
```

状态流转被收敛到 `bidStatusMachine`，而不是在多个 Service 方法里散落字符串判断。

## 回归清单

重构没有新增接口，因此回归重点放在行为一致性：

- 创建接口的必填校验和错误码是否保持一致。
- 截止时间边界：等于当前时间、刚过一秒、未来时间。
- 草稿提交后，列表状态和详情状态是否同步。
- 审计记录是否只在成功后写入。
- 并发提交同一条记录时，是否会重复写入审计日志。
- 原字段的驼峰命名是否在 VO 中保持不变。

这次回归里发现了一个问题：原 Controller 直接把 `deadline` 按默认时区序列化，改成 VO 后需要显式保留同样的时间格式，否则前端展示会偏移。这个问题在单元测试里没有暴露，最后由接口对比测试发现。

## 复盘

分层的价值不在于目录好看，而在于**变化发生时知道该改哪里**。这次重构之后，新增“撤回”入口只需要复用状态机和审计服务，没有再复制校验逻辑。

后续还可以继续做的两件事：

1. 把通用异常映射抽成全局处理，统一错误码结构。
2. 为状态机补一组表驱动测试，覆盖所有非法流转。

在此之前，我刻意没有引入更复杂的领域建模。当前规模下，清晰的 Service 边界已经足够。

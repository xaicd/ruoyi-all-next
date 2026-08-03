# database-compatibility

## Purpose

统一 all-next 领域在多数据库场景下的兼容策略定义与落地检查。

## Use When

1. 新增模块涉及数据库能力声明。
2. 需要评估兼容等级（Tier-A/Tier-B/Tier-C）。
3. 需要给出数据库方言差异隔离方案。

## Checklist

1. 声明兼容等级与目标数据库。
2. 方言差异收敛到 repository/adapter。
3. 跨数据库特性提供降级路径。
4. 更新治理声明与测试引用。

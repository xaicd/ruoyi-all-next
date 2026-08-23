---
name: database-design
description: 表、迁移、租户隔离、多数据库兼容。改 schema、仓储、SQL 时启用。
---

# 数据库设计

## 同时启用

`database-compatibility.SKILL.md`

## 权威

- `docs/architecture/ruoyi-all-next-database-compatibility.md`
- Prisma schema + 版本化迁移（PostgreSQL 为默认真源）
- 仓储：Kysely；无库时内存可回滚

## 清单

1. 表归属到域；跨域不共用可写表。阶段 C 才独立库。
2. 租户字段与查询过滤在仓储层，不靠前端传 tenantId。
3. 方言差异只留在 adapter；禁止业务 SQL 写死某一家函数还声称多库。
4. 参数化查询；禁止字符串拼接 SQL（见 security Skill）。
5. 迁移可重复、可回滚；生产镜像不夹带随意 migrate 入口除非文档允许。
6. 浏览器 DTO ≠ 表结构。
7. 兼容等级写入治理声明与 TestRefs。

## 门禁

涉及兼容或迁移时按 database-compatibility 更新矩阵，并补仓储测试。

## 禁止

`DB_PROVIDER` 切同一份 schema 冒充多数据库；在 Route 开事务。

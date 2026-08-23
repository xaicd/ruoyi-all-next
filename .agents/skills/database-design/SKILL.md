---
name: database-design
description: 表结构设计、迁移、多租户隔离、多数据库兼容。改 schema、仓储、SQL 时启用。
---

# 数据库设计与多库兼容规范

## 1. 适用场景
- 设计新业务表、扩展已有字段或设计多对多关联。
- 执行数据库迁移（Prisma Migration）。
- 编写 Kysely 仓储层查询与多数据库方言兼容适配。

## 2. 权威依据
- `AGENTS.md` §3.3 (数据库边界与 Kysely 仓储规范)
- `AGENTS.md` §4.6 (事务与状态守卫规范)
- `AGENTS.md` §6.1 (database-compatibility 治理规范)
- `docs/architecture/ruoyi-all-next-database-compatibility.md`
- Prisma Schema（PostgreSQL 为默认主源，兼顾 MySQL / 达梦 / Oracle）

## 3. 标准表结构六大审计字段 (强制包含)
所有业务表必须包含统一命名的多租户与审计字段：

```sql
tenant_id    VARCHAR(64) NOT NULL DEFAULT '0', -- 租户ID (多租户隔离)
creator      VARCHAR(64) DEFAULT '',          -- 创建人ID
create_time  TIMESTAMP NOT NULL DEFAULT NOW(),-- 创建时间
updater      VARCHAR(64) DEFAULT '',          -- 更新人ID
update_time  TIMESTAMP NOT NULL DEFAULT NOW(),-- 更新时间
deleted      BOOLEAN NOT NULL DEFAULT FALSE   -- 软删除标记 (0/1 或 false/true)
```

## 4. 索引设计铁律
1. **主键**：统一使用有序字符串 ID（如 NanoID / CUID / 雪花ID）或自增 BigInt。
2. **复合索引最左前缀**：涉及多租户查询时，索引必须以 `tenant_id` 为前导列：
   `CREATE INDEX idx_order_tenant_status_time ON mall_orders (tenant_id, status, create_time DESC);`
3. **软删除查询覆盖**：高频查询必须将 `deleted` 纳入组合索引考量。

## 5. 多数据库方言兼容规范
- **禁止使用单库专属方言函数**（如 PG 专有的 `jsonb_build_object` 或 MySQL 专有的 `FIND_IN_SET`）。
- 仓储层统一使用 **Kysely 查询构建器**，由驱动层抹平参数化占位符差异（PG `$1,$2` vs MySQL `?,?`）。
- 内存回退机制：当未连接真实物理数据库时，Repository 必须提供完全一致的 MEMORY_STORE 模拟实现，保证离线与轻量单元测试 100% 可行。

## 6. 绝对禁止项
- 严禁通过字符串拼接拼装 SQL（防止 SQL 注入）。
- 严禁跨域直接操作他域的数据表（必须走 Domain Facade）。
- 严禁生产环境无备份直接执行破坏性迁移（DROP COLUMN / DROP TABLE）。

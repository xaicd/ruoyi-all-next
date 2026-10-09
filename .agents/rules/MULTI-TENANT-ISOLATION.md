# MULTI-TENANT ISOLATION RULES (多租户数据隔离铁律)

本规范定义跨域业务表与系统表的租户隔离权威原则。

## 1. 租户来源唯一权威
- **全局上下文权威**: 租户唯一来源是 `getCurrentTenantId()`（`@/shared/backend/lib/biz-tenant`），由 `withAdminRoute` 在请求入口自动注入 `runWithTenantContext`。
- **严禁显式参数透传**: 严禁在 Service/Repository 方法签名中层层透传 `tenantId` 参数。透传链条极易断裂导致严重数据越权与泄露！

## 2. 仓储层 (Repository) 隔离规范
- 业务表 Repository 在执行 `findList`、`findById`、`create`、`update`、`delete` 时，一律从全局上下文获取当前租户。
- 当 `isTenantRequired()` 为 true 且处于非平台上下文时，无租户上下文的业务数据访问必须抛出异常，拒绝执行。
- 平台上下文（`isPlatformContext()`）与平台超级管理员拥有跨租户查询权限。

## 3. Kysely 自动隔离插件
- 底层统一挂载 `tenantIsolationPlugin`，在 SQL 查询构建阶段针对所有业务实体自动追加 `where tenant_id = ?` 约束，确保真实数据库与内存模式具备一致的安全性。

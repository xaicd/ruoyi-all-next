# 全局多租户能力 Spec

## 状态

- 状态：实施中
- 策略：共享库 + `tenant_id` 行级隔离；平台控制面显式豁免
- 启用方式：`TENANT_MODE=disabled|required`，默认 `disabled`，完成数据迁移后生产启用 `required`

## 目标

租户不是单个 System 页面功能，而是认证、路由、Repository、数据库、缓存、事件、文件、任务与所有业务域的一致数据边界。任意租户用户不得通过 ID、查询条件、缓存键、消息、导出或关联表读取/修改另一租户资源。

## 核心约束

1. 认证 token 中的 `tenantId` 是唯一请求租户来源；禁止从 body/query/header 接受客户端指定 tenantId。
2. 受保护的租户 API 在 `TENANT_MODE=required` 时缺失 tenantId 必须失败关闭。
3. 每张表都必须在“租户拥有”或“平台全局”台账中登记；`tenant_id IS NULL` 不是隐式全局。
4. 业务 Repository 读、写、更新、删除、唯一性检查和关联校验必须带同一 tenant scope。
5. 平台管理操作只能由具有 `TENANT_PLATFORM_ROLE`（默认 `platform-admin`）的已验签身份调用。
6. 缓存、锁、限流、事件、消息、WebSocket、文件与导出均使用 `tenantKey()` 或携带 tenant envelope。

## 租户模式

| 模式 | 用途 | 行为 |
|---|---|---|
| `disabled` | 现网迁移期/单租户兼容 | 保留 tenantId 传播，未绑定数据暂不拒绝 |
| `required` | 完整多租户生产模式 | 普通身份必须有 tenantId；未绑定 Repository 操作失败 |

## 认证与请求上下文

```ts
type TenantContext = {
  tenantId?: string
  actorId?: string
  endpoint?: "admin" | "app" | "open" | "internal"
  isPlatform: boolean
  traceId?: string
}
```

- 使用 `AsyncLocalStorage`，禁止 mutable process-global tenant 变量。
- 新路由使用 `runWithTenantContext` 或认证包装器；历史 `ensurePermission` 仅作为过渡适配。
- `isPlatform` 只能由已验签 JWT 中的平台角色导出，不能由前端 header 或请求参数设置。

## 数据所有权台账

### 必须隔离

- System：`system_user`、`system_role`、`system_dept`、`system_post`、用户/角色/岗位关联、登录/操作日志。
- System 内容：公告、字典、通知、短信、邮件、社交、OAuth2 token/client 的租户数据。
- Infra：租户配置、文件、文件归属、API 访问/错误日志、租户任务执行记录。
- 业务域：AI、BPM、CRM、ERP、IM、IoT、Mall、Member、MES、MP、Pay、Report、WMS 的全部业务实体、附件、导出和事件。

### 显式平台全局

- `system_tenant`、`system_tenant_package`、平台操作员、全局菜单目录与平台角色模板。
- 全局基础设施默认配置、数据库连接、调度定义、全局存储配置。
- 全局字典仅在产品确认后保留；否则改为租户拥有。

## 分阶段实施

1. **基础能力**：AsyncLocalStorage、模式配置、JWT tenant 绑定、平台角色、cache/event namespace。
2. **System 强制隔离**：用户、角色、部门、岗位、关联关系、日志；租户套餐持久化和权限菜单过滤。
3. **Infra 与设置隔离**：配置、文件、日志、OAuth2/SMS/Mail/Social/MP setting key 迁移。
4. **业务域隔离**：每个域在落库前设计 `tenant_id`、索引、外键、唯一约束、文件和事件归属。
5. **迁移与强制启用**：数据回填、null 行审计、双租户集成测试、staging 演练后启用 `required`。

## Schema 与迁移规则

- Prisma schema/migration 是关系模型唯一事实来源；Kysely type 需从其生成或 CI 校验。
- 租户拥有表须包含 `tenant_id`、`(tenant_id, business_key)` 唯一约束和常用 `(tenant_id, deleted, created_at)` 索引。
- 父子表和关联表须验证所有引用记录同 tenant，避免仅靠 ID 的越权访问。
- 先把历史记录回填到明确 legacy/default tenant，再将 tenant-owned 表改为 NOT NULL；不可直接对生产表强制非空。

## 验收矩阵

- 两个租户使用相同用户名/业务编码时可按策略共存且互不可见。
- 每个列表、详情、更新、删除、导出、关联查询均无法跨 tenantId 访问。
- 伪造 tenantId header/body/query 无效；JWT tenantId 与数据归属不匹配返回 403/404。
- cache、lock、rate-limit、WebSocket、event/MQ、file/export 键在两个租户间不冲突。
- 平台控制面可管理租户，但普通租户身份不能访问 Tenant/Package 管理接口。
- `TENANT_MODE=required` 下，缺少租户上下文、无 owner 的写入及未范围化查询均失败关闭。

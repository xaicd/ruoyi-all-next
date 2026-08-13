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


## 全量实施路线图

### 阶段 0：安全封口与基线盘点

1. 重写或隔离 `auth-gateway.ts`，禁止仅解码 JWT Payload，禁止信任 `x-user-id`、`x-permissions` 等客户端身份头。
2. 建立路由鉴权台账：Admin 使用严格 JWT + Permission；App 使用严格 App JWT；Open 使用 HMAC 签名；Internal 使用内部服务认证；Public 必须显式白名单。
3. 统一认证与授权错误：认证失败 `401`、权限不足 `403`、资源不存在 `404`、状态冲突 `409`。
4. 增加 JWT 篡改、过期、错误 endpoint、伪造身份头、平台控制面 RBAC 的自动化测试。

**完成标准：** 任何外部请求均不能经由遗留 Header、未验签 Token 或默认 `SYSTEM` 身份获得权限。

### 阶段 1：租户 Schema 与迁移准备

1. 建立全表数据所有权台账，逐表标记为“租户拥有”或“显式平台全局”。
2. 在 Prisma schema 中补齐 `SystemTenantPackage`、套餐菜单关系、租户关联/日志字段，并同步 Kysely 类型。
3. 设计核心表的租户索引与唯一约束：
   - `system_user (tenant_id, username)`；
   - `system_role (tenant_id, code)`；
   - `system_post (tenant_id, code)`；
   - 常用查询索引 `(tenant_id, deleted, created_at)`。
4. 设计关联表租户一致性策略；任何引用记录必须属于同一租户，或显式引用平台全局目录。
5. 对目标数据库执行只读结构审计、备份和 Prisma migration baseline；制定历史 `tenant_id` 回填、孤儿关联治理和重复业务键处理方案。
6. 建立 Prisma/Kysely schema 漂移检查，Prisma 为模型与迁移唯一事实来源。

**完成标准：** Prisma、Kysely、migration、现网数据库结构和历史数据回填方案一致。不得直接对生产库执行破坏性迁移。

### 阶段 2：System 域隔离闭环

1. 完成 `system_user_post` 用户—岗位关联的查询、替换、持久化与同租户校验。
2. 为用户—角色、角色—菜单、用户—岗位落实关联表一致性约束；菜单目录保留为显式平台全局数据。
3. 将 `TenantPackageRepository` 从内存实现替换为 Prisma schema/Kysely Repository 支持的真实持久化。
4. 让套餐实际参与权限计算：登录后解析租户套餐；菜单树和按钮权限按套餐过滤；角色菜单不得超出套餐允许范围；接口权限与套餐范围保持一致。
5. 为 System 日志、公告、字典、通知、邮件、短信、社交登录、OAuth2 等租户拥有数据补齐 tenant scope，覆盖列表、详情、更新、删除、导入和导出。

**完成标准：** 任意两个租户均不能通过 ID、关联 API、导出或菜单/接口权限读取或修改对方的 System 数据。

### 阶段 3：Infra 域隔离

1. 明确 `infra_config` 中平台全局与租户配置的边界，租户配置 key 必须按 tenant 唯一。
2. 为文件元数据、对象存储路径、下载预览删除操作增加租户归属和授权检查；对象 key 使用 `tenantKey()` 命名空间。
3. 将 API 访问日志、错误日志、任务日志与异步任务执行记录纳入 tenant scope。
4. 缓存、锁、限流、队列、事件、WebSocket、搜索索引、导入导出必须使用 tenant namespace 或 tenant envelope。
5. 明确定时任务模型：平台任务是显式全局；按租户任务必须在执行期间恢复对应租户上下文。

**完成标准：** Infra 资源、缓存键、对象存储、异步消息和日志不存在跨租户碰撞或泄漏。

### 阶段 4：业务模块逐域迁移

按“Schema → Repository → Service → Route → File/Event → 双租户测试”闭环逐域实施：Mall/Member/Pay、CRM/ERP/WMS/MES、BPM/Report、AI/IM/IoT/MP 及其他业务模块。

每个模块必须完成：

- 表所有权登记、`tenant_id`、租户内唯一约束和索引；
- Repository 所有读写、唯一性检查、关联检查、导出查询的 tenant scope；
- 父子表和关联表的同租户验证；
- 文件、缓存、事件、搜索索引和导出产物的租户隔离；
- 双租户集成测试。

**完成标准：** 所有业务实体均有明确所有权，不保留隐式“默认全局”数据。

### 阶段 5：生产数据治理与强制启用

1. 回填历史租户拥有数据，审计并清理 `tenant_id IS NULL`、孤儿关联、跨租户引用和重复业务键。
2. 在 staging 使用脱敏双租户数据完成 migration、回归、导出、文件、缓存与异步任务演练。
3. 先保持 `TENANT_MODE=disabled`；通过 staging 验收后灰度切换至 `TENANT_MODE=required`。
4. 监控缺失租户上下文、跨租户拒绝、401/403 异常、缓存/事件 tenant 缺失、文件访问拒绝和唯一约束冲突。
5. 将临时 `TENANT_PLATFORM_USERNAMES` 映射替换为真实的平台操作员/RBAC 模型。

**完成标准：** `required` 在生产稳定运行；未绑定租户身份和未范围化数据访问均失败关闭。

### 并行安全与持久化收敛

- 新密码改用 Argon2id（首选）或 bcrypt，旧 MD5 + salt 仅限登录时渐进迁移。
- Open API 实现 HMAC-SHA256、时间戳、nonce 防重放、密钥轮换与限流。
- 生产环境移除 Prisma mock、内存 Repository 和 DummyDriver 的静默降级。
- 明确 Prisma/Kysely 表所有权与事务边界，禁止无适配器的跨 ORM 事务混用。

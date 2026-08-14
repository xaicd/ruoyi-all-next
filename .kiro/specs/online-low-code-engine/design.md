# Design Document: Online Low-Code Engine

## Overview
Online 引擎借鉴 JeecgBoot 的“配置数据模型后可直接运行/测试”的产品能力，但从零设计为 Next.js + PostgreSQL + Prisma + Kysely + Puck 架构。它避免动态 force-sync、浏览器 `eval`、前端权限开关和表名隐式流程绑定。Definition 是唯一业务配置入口；Puck 只保存 View layout；Release 是 Runtime 与代码生成的唯一输入。

## Architecture

### Scope and Boundaries
```text
Definition / Revision
├── DataModel: fields, indexes, relations, model type
├── Interaction: list, query, form, detail, validation
├── Presentation: OnlineViews + Puck layout
├── Behavior: built-in actions + registered server actions
├── Policy: fields, actions, row scope
├── WorkflowBinding
└── Release: immutable snapshot + schema revision

Runtime -> PUBLISHED Release only
Codegen -> PUBLISHED Release only
Puck -> Presentation only
```

- `SINGLE`：标准单表业务。
- `TREE`：声明 `parentField`、排序、根节点与可选 children indicator；禁止仅由页面猜测树关系。
- `MASTER_DETAIL`：声明主定义、子定义、外键、级联规则和事务边界；主子写操作使用同一 Kysely transaction。
- `WORKFLOW`：在任意模型之上附加显式 `WorkflowBinding`，不通过物理表名拼装 process key。

## Data Models
Prisma 是模型、关系、索引和 migration 的唯一事实来源；Kysely 为 Online Repository 与 Runtime 查询执行层。所有 Online 元数据表为 tenant-owned。

```text
online_definition
  id, tenant_id, code, name, model_type, status, current_draft_revision_id,
  published_release_id, lock_version, created_by, updated_by, timestamps

online_revision
  id, definition_id, tenant_id, sequence, status(DRAFT|VALIDATED|PUBLISHED|ARCHIVED),
  schema_revision, model_json, interaction_json, policy_json, workflow_json,
  validation_report, created_by, published_by, timestamps

online_field / online_index / online_relation
  revision_id + tenant_id; structured columns for compiler/indexing

online_view
  revision_id, code(list|form|detail|dashboard), kind, puck_data_json,
  component_config_json, version

online_action / online_policy / online_workflow_binding
  revision_id + tenant_id; action registry key / limited expression / subject bindings

online_release
  id, definition_id, revision_id, tenant_id, release_no, snapshot_json,
  schema_revision, checksum, released_by, released_at, rollback_of_release_id

online_schema_change
  id, definition_id, revision_id, tenant_id, plan_json, risk, status,
  approval, execution_log, expected_schema_revision, applied_schema_revision

online_runtime_record (optional generic storage phase)
  tenant_id, definition_id, schema_revision, payload_json, lifecycle fields
```

初始版本使用受控的通用记录存储或仅绑定已存在业务表；动态业务物理表只可通过 Migration Plan 创建。后续将高频 Definition 生成专用表/Repository。所有唯一约束和索引必须至少含 `tenant_id`，尤其是 `(tenant_id, code)`、`(tenant_id, definition_id, sequence)`、`(tenant_id, revision_id, view_code)`。

## Revision, Migration and Release State Machines
```text
Definition: DRAFT -> ACTIVE -> ARCHIVED
Revision:   DRAFT -> VALIDATED -> PUBLISHED -> ARCHIVED
SchemaPlan: DRAFT -> REVIEW_REQUIRED|APPROVED -> APPLYING -> APPLIED|FAILED
Release:    immutable; current release may be switched by rollback
```

1. 编辑只写 Draft Revision，并带 `expectedLockVersion`。
2. compiler 校验字段、关系、视图引用、策略和 Puck allowlist，产生 Validation Report。
3. diff 生成 SchemaChange；开发/测试环境可申请安全 DDL，生产仅允许审核批准的 expand/backfill/cutover 操作。
4. SchemaChange 成功且版本匹配后才能 Publish；Publish 把完整结构化配置与 Puck Data 固化到 `snapshot_json` 并计算 checksum。
5. Runtime 通过 Definition 当前 Release 读取 snapshot；回滚只是原子切换指针到以前的有效 Release。

## Components and Interfaces

### Runtime Architecture
```text
Admin route -> withAdminRoute -> OnlineDefinitionService
Runtime route -> auth/tenant/policy -> ReleaseResolver -> RuntimeCompiler
  -> OnlineRepository -> Kysely transaction/query -> DTO sanitizer -> Puck Runtime Renderer
```

- 管理 API：Definition、Revision、Migration Plan、Publish/rollback、Preview、Test Session、Codegen。
- Runtime API：按 `definitionCode + viewCode` 路由；只解析 Publish snapshot。
- Runtime Compiler：将 Release 编译成有效字段集、Zod command schema、list query schema、row predicate、allowed actions、Puck component bindings。
- Online Repository：执行 tenant-scoped CRUD、树查询、主子表事务和分页；任何 external `tenantId` 均被忽略。
- DTO sanitizer：按 field-read policy 剔除字段；write schema 按 field-write policy 拒绝非法字段。
- 所有变化经过 `withAdminRoute` 或受控 App Runtime wrapper，以承接 JWT、tenant context、trace、访问日志和审计。

## Puck Integration
Puck config 抽至 `modules/online/frontend/puck/online-puck.config.tsx`，编辑器与渲染器共享同一 config。组件将通过 `definitionCode`/`viewCode` 绑定 Runtime，而非用户填写端点。

```ts
type OnlinePuckProps = {
  definitionCode: string
  viewCode: "list" | "form" | "detail" | "dashboard"
  fieldScope?: string[]
  actionScope?: string[]
  layout?: "default" | "drawer" | "dialog" | "inline"
}
```

保存时执行 Zod JSON size/depth/component allowlist 校验；未知 component、非法 props、字段/动作不属于 Revision 的引用一律失败。发布 Runtime 使用 `Render` 真实渲染已发布 Puck Data，替换现有 `page-render` 的摘要渲染。

## Online Test Experience
在线测试不是纯 preview。Definition 工作台显示 Draft/Release/schema 状态，并提供：

```text
设计 → 数据模型检查 → Migration Plan → 执行/等待审批 → 发布
  → 预览布局 → 进入在线测试 → 真实列表/新增/编辑/删除/流程动作
  → 查看审计、trace、运行错误和生成预览
```

`/admin/infra/online-definitions/:code/test` 加载与正式 Runtime 同一 renderer/API。测试 Session 记录 actor、tenant、release、schema revision 和开始/结束时间；默认展示 sandbox 标识。生产运行时写操作要求显式 feature flag 与确认，永不以 UI 限制代替服务端检查。

## Policy and Action Design
- 管理权限：Definition CRUD、migration apply、publish、test、generate 分离。
- Runtime Policy：subject（role/user/dept）、field read/write、action execute、row predicate 四层；服务端编译为 Repository 过滤与 command schema。
- Action：`create`、`update`、`delete`、`export`、`import`、`submitWorkflow` 与有 manifest 的 `serverAction`。`serverAction` 只能调用白名单 handler，载荷由 Zod 验证。
- 表达式：仅支持 JSON Logic/有限 AST（比较、布尔、字段访问、常量），不允许 `eval`、`Function`、动态 import、任意 SQL 或存储代码。
- Workflow：绑定 provider/processKey、record status field、可启动/可编辑/可删除状态和 transition policy。


## Correctness Properties

### Property 1: 发布快照隔离
**Validates: Requirements 1.3, 1.4, 3.1**

任意 Draft 编辑不会改变当前 Runtime 的响应；只有成功 Publish 后，Runtime 才原子切换到新 Release。

### Property 2: 数据与租户安全
**Validates: Requirements 1.2, 2.4, 5.2**

任意 Runtime 查询、详情、写入、树/主子关联与导出均由服务端 tenant scope 和 policy 编译结果约束；请求 body/query 中的 tenantId 无法扩大范围。

### Property 3: Puck 不能越权
**Validates: Requirements 4.1, 4.2, 4.3**

任何未知 Puck component、非法 prop、任意 endpoint、HTML、脚本、SQL 或不存在的 field/action 引用都会被保存或发布校验拒绝。

### Property 4: 在线测试与正式 Runtime 同构
**Validates: Requirements 3.2, 3.3, 3.5**

在线测试和正式 Runtime 使用同一 Release Resolver、Runtime Compiler、validator、policy 和 Repository；两者仅由环境/sandbox guard 区分。

## Error Handling

认证失败返回 401、管理或 Runtime policy 拒绝返回 403、Definition/Release 不存在返回 404、乐观锁或 schema revision 冲突返回 409、输入/配置/布局校验失败返回 400。Migration 执行失败必须将 Plan 标为 FAILED，写入安全错误摘要和 trace，不得将 Release 标记为可运行。未知 Puck 组件、任意脚本、任意 SQL、生产破坏性 DDL 和未注册 Action Handler 一律 fail closed。

## Testing Strategy

单元测试覆盖 Model IR、schema diff、Puck allowlist、Release checksum、policy compiler、表达式 AST 和专用 codegen renderer。真实测试数据库集成测试覆盖安全 migration、schema lock、SINGLE/TREE/MASTER_DETAIL CRUD、同租户关联、双租户隔离、发布/回滚和 Workflow 状态。浏览器 smoke 覆盖设计、迁移、发布、进入在线测试、真实 CRUD、审计和权限拒绝。发布前执行 Prisma validate/generate、Kysely schema 检查、定向 Vitest、路由保护检查、TypeScript/构建可行的最小验证。
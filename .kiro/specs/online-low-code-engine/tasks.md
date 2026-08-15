# Implementation Plan: Online Low-Code Engine

## Overview
本计划建设完整 Online 能力，而非仅扩展 Puck 原型。每一阶段必须交付可运行的浏览器在线测试路径；数据库变更、发布、权限与代码生成在同一 Definition/Release 链路中闭环。

## Task Dependency Graph
```json
{
  "waves": [
    { "id": "wave-1", "tasks": ["1"], "dependsOn": [] },
    { "id": "wave-2", "tasks": ["2", "3"], "dependsOn": ["wave-1"] },
    { "id": "wave-3", "tasks": ["4", "5"], "dependsOn": ["wave-2"] },
    { "id": "wave-4", "tasks": ["6", "7"], "dependsOn": ["wave-3"] },
    { "id": "wave-5", "tasks": ["8"], "dependsOn": ["wave-4"] }
  ]
}
```

## Tasks

- [ ] 1. 冻结 Online 契约、安全边界与现有原型基线
  - [ ] 1.1 建立 `modules/online` 的 contract、route manifest、validators、application、ports、persistence adapters、frontend ports/adapters/pages 目录；记录 API operation、权限、tenant scope、超时和错误语义。
  - [ ] 1.2 审计 `infra/pages` 和 `page-builder` 原型：列出未鉴权路由、内存持久化、未共享 Puck config、摘要渲染与 API 契约不一致，标记为迁移对象而非正式能力。
  - [ ] 1.3 定义 Online 管理权限、Runtime 权限、菜单、默认角色基线和持久化菜单/角色授权迁移；不只更新常量或静态菜单。
  - [ ] 1.4 登记所有新 API、定义开发/测试/生产的 feature flags、在线测试数据保留与清理策略、审计字段和风险说明。

- [ ] 2. 构建版本化元数据与发布基础（依赖：1）
  - [ ] 2.1 在 Prisma schema 建立 `online_definition`、`online_revision`、`online_field`、`online_index`、`online_relation`、`online_view`、`online_action`、`online_policy`、`online_workflow_binding`、`online_release`、`online_schema_change` 和 `online_test_session`；补齐 tenant 外键、唯一约束、分页索引和软删除策略。
  - [ ] 2.2 生成命名 migration，并同步 Kysely `schema.ts`；建立类型漂移检查，禁止生产内存回退。
  - [ ] 2.3 实现 tenant-scoped Repository、Application Service 和 Zod command/query schema；草稿编辑使用 `expectedLockVersion`，冲突返回 409。
  - [ ] 2.4 实现 Definition/Revision 列表、详情、创建、复制、归档、Revision 校验、Release 查询与 rollback API；全部接入 `withAdminRoute`、审计和 trace。
  - [ ] 2.5 为双租户隔离、同租户 code 唯一、乐观锁、不可变 Release 及回滚添加定向测试。

- [ ] 3. 实现数据模型编译与受控数据库变更（依赖：1）
  - [ ] 3.1 定义 `SINGLE`、`TREE`、`MASTER_DETAIL` 的字段、索引、关联、字典、默认值、查询与校验 DTO；编译为内部 Model IR，不以 Puck JSON 推断模型。
  - [ ] 3.2 实现 schema diff 与 Migration Plan：expand/backfill/cutover/contract 分类、风险等级、影响对象、可执行步骤、向前修复和人工审批状态。
  - [ ] 3.3 在开发/测试数据库实现非破坏性迁移执行器、schema revision 锁、幂等性、失败日志与恢复；生产禁止 force drop/recreate 和未批准的 destructive DDL。
  - [ ] 3.4 实现树 parent 关系、主子外键、同租户关联校验、索引/唯一约束验证及主子事务边界。
  - [ ] 3.5 为 Model IR、diff、拒绝风险 DDL、并发 migration、树/主子一致性建立真实测试数据库集成测试。

- [ ] 4. 重构 Puck 为受控 OnlineView（依赖：2）
  - [ ] 4.1 抽取共享 `online-puck.config.tsx`，把编辑器与 Runtime Renderer 统一到同一 allowlist config；移除现有摘要式 `RenderWithConfig`。
  - [ ] 4.2 用 `OnlinePageHeader`、`OnlineSearchForm`、`OnlineDataTable`、`OnlineForm`、`OnlineDetail`、`OnlineActionBar`、`OnlineMasterDetail`、`OnlineStatistic`、`OnlineChart` 取代可填任意 API endpoint 的物料。
  - [ ] 4.3 建立 OnlineView 编辑 API 和 Puck Data 校验：大小、深度、组件、props、definition/view/field/action 引用、未知值拒绝。
  - [ ] 4.4 将 `/admin/infra/page-builder` 迁移为 Online Definition 工作台，保留导出 JSON 作为受审计的蓝图导出；旧 `infra/pages` 只保留兼容重定向直至迁移完成。
  - [ ] 4.5 实现 Draft Puck preview 与 Published Release Puck render 的一致性 fixture 测试。

- [ ] 5. 单表 Runtime 与在线测试闭环（依赖：2、3、4）
  - [ ] 5.1 实现 Release Resolver、Runtime Compiler、tenant-scoped Online Repository、DTO sanitizer 和 Runtime API；只允许访问已发布 snapshot。
  - [ ] 5.2 实现标准单表列表、字段查询、分页、排序、详情、新增、编辑、删除、必填/类型/枚举校验及审计。
  - [ ] 5.3 实现 `/admin/infra/online-definitions/:code/test`：展示 Release/schema revision/sandbox 状态，调用和正式 Runtime 相同的读写 API，创建 `online_test_session` 和操作记录。
  - [ ] 5.4 为预览、在线测试、正式 Runtime 分别建立路由和 feature flag；测试不通过模拟成功，生产写入必须保持服务端权限、确认和环境门禁。
  - [ ] 5.5 用浏览器 smoke/集成测试验证：创建 Definition → 配置字段 → 生成/应用安全迁移 → 发布 → 打开在线测试 → 真实创建/查询/编辑/删除 → 查看审计。

- [ ] 6. Policy、动作、导入导出与流程绑定（依赖：5）
  - [ ] 6.1 实现角色/部门/用户 subject 绑定、field read/write、action execute、row scope policy 的服务端编译与拒绝语义；浏览器仅消费已经裁剪的 DTO/config。
  - [ ] 6.2 实现 action registry 和内置 CRUD、导出、导入、批量动作；自定义动作只允许受注册的 server handler、Zod 输入、审计和幂等键。
  - [ ] 6.3 实现受限 AST/JSON Logic 条件规则与测试；显式禁止 `eval`、`new Function`、动态 import、任意 SQL 和数据库保存代码执行。
  - [ ] 6.4 实现 WorkflowBinding：流程 provider/process key、状态字段、允许编辑/删除/发起状态、transition policy；先提供 provider adapter，后接 BPM 实体。
  - [ ] 6.5 添加字段越权、动作越权、row scope 跨租户、导入导出、表达式拒绝和 workflow 状态转换测试。

- [ ] 7. 树、主子表、复杂视图与可用性（依赖：5、6）
  - [ ] 7.1 实现 TREE Runtime：根节点、懒加载/全量树、循环保护、排序、树查询和策略过滤。
  - [ ] 7.2 实现 MASTER_DETAIL Runtime：主子表 Puck 视图、嵌套校验、同 tenant 外键、单事务 create/update/delete、明细权限与差量更新。
  - [ ] 7.3 增加详情、抽屉/弹窗/内嵌表单、统计和图表等 Puck 视图绑定；图表只使用受控聚合/Query Definition。
  - [ ] 7.4 提供 Online Runtime loading/error/empty 状态、响应式与无障碍检查，并记录跨浏览器在线测试证据。

- [ ] 8. 从 Release 增强代码生成器并完成发布治理（依赖：6、7）
  - [ ] 8.1 扩展 `CodegenEngineService` 输入为 PUBLISHED Release；生成 tenant-aware Repository、validator、service、protected routes、typed API、List/Form/Detail、Puck blueprint、菜单/权限 migration 和 manifest。
  - [ ] 8.2 为 CRUD、TREE、MASTER_CHILD、WORKFLOW、SINGLETON 实现专用 renderer 和 fixture；不支持的模板必须 fail closed。
  - [ ] 8.3 接入 dry-run、代码预览、ZIP 下载和 manifest injector；不得覆盖手工文件，生成物保留 Release checksum/source metadata。
  - [ ] 8.4 增加生成前一致性检查：Release 已发布、schema revision 已应用、政策/动作/流程可编译、所有 Puck 引用存在。
  - [ ] 8.5 完成文档、菜单加载、API 清单、操作手册、migration/rollback runbook、在线测试 runbook、观测指标和告警；运行定向测试、Prisma/Kysely 校验、路由保护检查、构建与 `git diff --check`。

## Exit Criteria
- 管理员可在浏览器完成单表、树和主子表 Definition 的配置、校验、受控 schema 变更、发布和回滚。
- 已发布页面可通过 Puck Runtime 真实渲染；在线测试页可对真实隔离数据完成 CRUD 与策略验证。
- 不存在客户端任意脚本执行、任意 SQL、未鉴权配置 API、生产 force-sync 或跨租户数据访问。
- 代码生成器能从已在线验证的 Release 输出专用场景源码，并可预览/下载且不覆盖人工代码。


## Notes
- “在线测试”是正式 Runtime 的受控入口，不是静态预览；它必须调用同一服务端策略、验证、事务与审计链路。
- 数据模型变更先走 Migration Plan；生产环境绝不复刻 Jeecg 式强制删表同步。
- Puck 仅负责页面布局，不能承载 schema、SQL、权限或可执行脚本。
- 任务 2 和 3 属于中风险数据库/配置改动：上线前必须在专用测试库与 staging 演练，生产执行须备份、审批并具备向前修复方案。


## Screenshot-derived Product Experience Backlog

> 来源：Jeecg Online 页面截图功能学习；仅作为产品交互对标，不复制存储 JS/Java/SQL、强制同步或动态 DDL 机制。

- [ ] 9. 完整 Online 表单资产与多页签设计体验（依赖：2、3、4）
  - [ ] 9.1 改造 Online 列表为资产管理页：表单名称/编码/类型/分类/状态/Draft 版本/Published Release/更新时间筛选，新增、复制、归档、批量操作和设计入口。
  - [ ] 9.2 增加基础属性 IR/UI：分类、受控主键策略、列表/表单布局、分页、复选框、树设置；所有 props 均使用固定枚举和服务端校验。
  - [ ] 9.3 实现字段设计网格：字段代码、名称、类型、长度/精度、默认值、必填、系统字段模板、排序；保持 Model IR 为唯一事实来源和 Schema Plan gate。
  - [ ] 9.4 实现页面属性网格：列表/表单/详情可见性、排序、字段宽度、布局 span、widget、readonly、固定 formatter key、查询 widget/operator；禁止任意组件参数和脚本转换器。
  - [ ] 9.5 实现校验与字典页签：Validation IR、dictionary/reference registry、服务端 Zod 编译和 tenant-scoped 引用验证。
  - [ ] 9.6 实现关系、索引、查询配置页签：Relation/Index/Query IR，所有结构改动先进入无 SQL 输出的 Schema Plan。
  - [ ] 9.7 实现发布治理页：完整展示 Draft 校验、视图指纹、Schema Plan 风险、Release 时间线、回滚、进入 Release-fixed sandbox Test。

- [ ] 10. 受控数据源导入和 Release 代码生成入口（依赖：8、9）
  - [ ] 10.1 在授权数据源上提供只读 schema introspection，导入结果必须为 Draft Model IR 并要求显式确认；禁止任意连接、SQL 和自动同步。
  - [ ] 10.2 提供 Release codegen dry-run、文件预览与 ZIP 下载；仅使用已发布 Release，保留 checksum 与来源元数据。

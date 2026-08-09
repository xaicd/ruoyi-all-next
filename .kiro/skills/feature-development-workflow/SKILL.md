---
name: feature-development-workflow
description: 用于新增、设计、开发、生成、配置或上线三端业务功能。强制执行业务需求、数据库与索引、API、程序设计、受控代码生成、动态菜单配置和加载验收的完整流程；适用于“新增功能”“设计接口”“设计表结构”“生成 CRUD”“配置菜单”等请求。
---

# 功能开发全流程

## 目标

所有新功能必须按“**业务需求 → 数据库与索引 → API → 程序设计 → 代码实现/生成 → 三端动态配置 → 迁移加载与验收**”推进。不得直接从页面、接口或模板开始编码，也不得把可运行的生成骨架当作已交付业务功能。

`3 分钟出功能`只适用于**设计已完成、低风险、标准只读列表壳**的批量生成；不适用于需要数据建模、写操作、状态机、资金、库存、履约、审批或外部集成的完整业务交付。

### 0.1 履约、资源与资源业态 Feature Gate（强制）

新增或改变以下任一能力时，必须以本 Skill 作为唯一编排流程完成设计、实现与交付；不得通过 `feature:generate`、页面模板或单一菜单/API 改动绕过：

- 新增/调整 `FulfillmentType`、`SkuStockMode`、订单履约状态或完成/退款/结算触发点；
- 新增可预订、可分配、可核销、可配送或上门服务的资源实体、容量/日历、库存策略或资源业态；
- 新增 `ProductSku` 到履约资源的 Binding、`ResourceResolver`、预约/预占/确认/释放链路，或影响既有资源业态；
- 新增履约方、发货/自提/上门/到店责任、异步任务、Cron、Outbox、第三方回调或补偿流程。

**立项档案**必须写入 `docs/features/<feature-id>.md`；复杂变更同时建立 `.kiro/specs/<feature-id>/`。档案至少包含下表事实，并在交付时填写为实际证据，而不是待办描述：

| Gate | 必须冻结的设计事实 | 交付证据 |
|---|---|---|
| 领域与数据 | `ProductType × FulfillmentType × SkuStockMode` 合法三元组、资源实体、强类型 Binding/真实外键、历史订单与履约快照 | Prisma/迁移方案、索引、数据回填与兼容边界 |
| 资源与并发 | Resolver 的 `quoteAvailability → reserve → confirm/release`、状态机、幂等键、并发/CAS/锁、超时与补偿 | 定向单元/集成验证、失败与重试记录 |
| 交易与责任 | 验价、库存/资源预占、履约责任、取消/退款/结算触发与不可变分配快照 | Service 事务边界、Outbox/回调或人工复核方案 |
| 三端与治理 | Admin/商户/C 端入口、数据库 RBAC、动态商户菜单、C 端展位、审批、通知与审计 | 实际加载、权限拒绝、scope 隔离及移动端验证 |
| 上线交付 | API 登记、Feature Gate、迁移顺序、Feature Flag/降级、可观测性与回滚/补偿 | `docs/api-routes.md`、验证命令结果、`docs:sync-context` 索引 |

资源业态必须复用 `ResourceWorkspaceDefinition` 与共享商品 UI；注册表只提供默认语义，不能替代动态菜单、C 端展位、数据库 RBAC 或审批。新资源一律使用强类型 Binding 和 Resolver，禁止 `resourceType + resourceId` 弱多态交易关系。完整资源接入清单见 `docs/features/resource-workspace-ui-foundation.md`，统一商品与订单快照边界见 `docs/features/unified-product-resource-model.md`。

### 0.2 持续改进闭环（功能开发与调试必须遵循）

每次功能开发、调试或验收不只解决当前问题，还应以**选择性记录 → 活跃经验 → 证据晋升 → 过期降级**减少同类问题复发。运行时记录位于 `.kiro/skills/feature-development-workflow/learning/`；它是本地、可审计的辅助记忆，不替代本 Skill、AGENTS.md 或任何安全/领域规范。

1. **开始任务**：执行 `npm run workflow:learning:review`；若存在 `active-rules.md`，仅将其中与当前功能相关的条目作为补充检查项。项目既有强制规则优先。
2. **选择性捕获**：只在出现以下可复用事实时记录一条简洁、脱敏的经验：用户纠正、已确认的验证/工具失败根因、经验证的项目发现、稳定偏好。不得记录正常成功日志、未证实猜测、原始命令输出、密码/Token/Cookie/支付凭证、PII 或生产数据。
3. **记录与聚合**：任务结束时使用 `npm run workflow:learning:record -- --type <correction|failure|discovery|preference> --pattern <kebab-case> --scope <feature-or-debug-id> --summary <已证实事实> --prevention <后续预防动作> [--evidence <验证证据>]`。同类根因必须复用同一 `pattern`；脚本会自动刷新活跃经验和晋升候选。
4. **自动活跃、受控晋升**：同一模式累计 3 条证据且 45 天内仍有正常敏感度证据时，脚本自动写入可随时降级的 `active-rules.md`。资金、权限、安全、个人信息和生产数据相关经验必须加 `--sensitivity sensitive`，只能进入人工审查，绝不自动成为活跃或永久规则。
5. **永久升级门禁**：`promotion-candidates.md` 仅是候选清单。只有用户/项目负责人明确批准，并确认跨任务可复用性、现有规范一致性、可验证预防动作和最小影响范围后，才能人工修改 `SKILL.md`、AGENTS.md 或作用域规范。禁止脚本、Hook 或 Agent 自动改写永久规则。

完整使用说明与评审清单见 `docs/guides/feature-workflow-learning.md`。每次批准的永久规则升级后必须运行 `npm run docs:sync-context`。

## 0. 先分类并设置门禁

开始实现前，识别功能类型、涉及三端、数据敏感度和风险域：

- **可生成 v1**：`standard` 域、非敏感、只读 `GET` 列表、无个人数据、无资金/库存/订单/履约/审批、无外部回调、Worker 或 Cron。
- **人工领域实现**：订单、SKU/库存、支付、钱包、退款、结算、供销/代发、履约、预约资源、审批、个人信息、外部回调、异步任务、Cron、跨组织资金或任何状态机。
- 高风险功能必须先完成领域规格、权限设计、事务/幂等/补偿设计；禁止用通用模板绕过设计与审查。

## 1. 业务需求设计（先于编码）

为功能建立或更新 `docs/features/<feature-id>.md`（复杂功能优先使用 `.kiro/specs/<feature-id>/`），至少明确：

1. 业务目标、范围与非目标。
2. 用户角色、组织数据范围、Admin/商户/C 端入口及授权方式。
3. 主流程、异常流程、取消/退款/补偿流程和验收标准。
4. 数据分类、隐私边界、审计要求、外部系统和异步依赖。
5. 是否需要动态菜单、C 端展位、字典、审批、消息通知或定时任务。

未完成需求和验收标准时，不得生成数据库迁移或业务代码。

## 2. 数据库与索引设计

先设计 Prisma 模型和迁移，再写 Service/API：

- 明确实体关系、真实外键、组织/商户/用户归属、唯一约束、枚举、审计字段、历史快照和删除策略。
- 从真实读写路径倒推索引：列表筛选、排序、分页、租户/组织隔离、唯一查找和任务扫描均要有对应索引或明确不建索引的原因。
- 订单与交易类模型必须遵守统一商品、资源、供销、结算与资金守恒规格；不得用弱多态 `resourceType + resourceId` 替代强类型关系。
- 迁移按 `expand → backfill → dual-write → cutover → contract` 设计；破坏性变更需独立评审与回滚/补偿方案。
- 数据库变更后执行对应 Prisma generate/migration/索引核验；不得用前端字段或临时 JSON 代替权威交易数据。

## 3. API、权限与数据契约设计

在实现 Route 前完成以下设计：

- 在 `docs/api-routes.md` 登记方法、路径、路由文件与说明，遵守三域前缀：`/api/*` 或 `/api/user/*`、`/api/merchant/*`、`/api/admin/*`。
- 定义 Zod 输入、分页、统一响应 `{ success: true, data }`、错误码和 HTTP 状态码。
- 新功能先在代码注册表 `PERMISSIONS` 声明权限语义，并在 `ROLE_PERMISSIONS` 给出系统角色的默认基线；这两处是安全白名单与首次初始化来源，不是运行时唯一授权来源。
- 后台功能必须通过迁移、种子或受控初始化将菜单写入 `AdminMenu`，并通过 `AdminRole`、`AdminRoleMenu` 持久化角色菜单授权；运行时导航与角色授权统一由 `AdminRbacService` 从数据库读取。不得只改 `admin-menu.ts`、注册表或角色映射后宣称菜单/权限已上线。
- 生成器不会创建或猜测权限，也不会自动写入 `AdminMenu`/`AdminRoleMenu`；功能交付必须补齐对应的数据库配置、后台管理入口和加载验收。
- Service 层定义数据隔离、事务边界、幂等键、并发控制、日志事件、审计和外部调用失败补偿。
- 所有业务枚举先注册数据字典 Key 与默认字典；禁止在页面/表单硬编码选项。

## 4. 程序设计与人工实现

根据风险级别实现：

- Route 保持薄层：鉴权 → Validator → Service → 统一响应/错误处理。
- Service 承担业务校验、组织数据范围、事务、日志、状态变更和领域错误。
- 状态型功能先定义状态机及合法转换；并发写入先定义幂等、CAS/锁、重试与补偿。
- 资金操作只能走既有账本/钱包双向记账；库存、供应和外部回调遵循各自的 Outbox、确认和人工复核门禁。
- 三端页面必须使用既有 UI 模板与通用组件，加载/错误/空状态、响应式、无障碍和适老化要求不可省略。

### 4.1 图片资产统一上传（强制）

新增或编辑表单涉及图片（如品牌图标、封面、图册、资质图片、实景图）时，必须使用项目统一上传组件和受控上传 API：

- 禁止提供手填图片 URL、第三方图片链接或将外部 URL 作为图片资产的常规录入方式；业务字段仅保存统一上传成功后返回的托管 URL（或受控资产记录）。
- 优先复用 `ImageUploader`；若场景需要专用上传组件，也必须复用统一上传 API、文件类型/大小校验和存储治理，禁止各页面自行实现上传链路。
- 表单必须提供清晰字段标签、上传中状态、失败反馈、图片预览与移除/替换操作；展示图片时应按内容提供有意义的替代文本，纯装饰预览使用空替代文本。
- 新增图片字段前，确认上传端点具备该业务所需的认证、权限、租户上下文与配额治理；不得从客户端传入或信任租户标识。

## 5. 受控代码生成（仅在设计获批后）

当前 `next-standard-readonly-v1` 仅生成低风险只读壳。满足第 0～3 步并准备好 FeatureSchema 后：

```bash
npm run feature:plan -- --schema scratch/<feature-id>.feature.json
npm run feature:generate -- --schema scratch/<feature-id>.feature.json
npm run feature:verify
npm run feature:check
```

生成器会创建 Validator、Service、三端页面和 GET Route、注册表、API 文档与 manifest。它不会生成 Prisma 模型、迁移、写接口、交易逻辑、审批、Cron 或外部集成。

- 先运行 `feature:plan` 评审完整 RenderPlan，未通过预检不得生成。
- 生成后必须补齐真实查询、数据隔离、日志和领域实现；空列表 Service 仅是可加载骨架。
- 不得手改受控文件后继续依赖安全撤销；需要人工维护时先迁移或撤销重建。
- 需要新模板能力时，新增显式版本化模板包与 Schema 版本，不得修改已发布模板语义。

## 6. 三端动态配置

所有新增功能必须检查三端入口：

- **运营后台**：先在代码注册权限语义与默认角色基线，再通过迁移、种子或 `AdminRbacService` 将菜单写入 `AdminMenu`、将角色菜单授权写入 `AdminRole`/`AdminRoleMenu`；运行时导航和授权以数据库记录为准，`admin-menu.ts` 仅可作为 bootstrap/兼容蓝图。
- **商户端**：菜单项注册表提供合法项和默认值；按业态与单商户的最终菜单必须写入 `Setting`（`merchant_menu_config_*` / `merchant_menu_override_*`），并由 `MerchantMenuService` 运行时加载。
- **C 端**：默认入口可由代码提供，但实际展位配置必须通过 `QuickEntryService` 持久化到 `Setting(key = "cend_quick_entries")` 后由运行时读取；禁止硬编码首页金刚区入口。
- **字典与配置**：经营类型、设施、状态、银行等业务枚举使用统一数据字典；配置应可由后台维护。

## 7. 迁移、加载和验收

交付前按功能实际范围执行：

1. 执行 Prisma generate/migration、必要回填与索引核验。
2. 运行定向单元/集成测试、类型检查、lint 和构建可行的最小验证。
3. 验证 Admin、商户端、C 端入口、权限拒绝、数据隔离、移动端布局及长辈大字模式。
4. 对生成模块运行：
   ```bash
   npm run feature:verify
   npm run feature:check
   ```
5. 更新 `docs/features/`、`docs/api-routes.md` 和相关运维/架构文档，最后运行：
   ```bash
   npm run docs:sync-context
   ```
6. 不再需要的生成模块先预览再撤销：
   ```bash
   npm run feature:revert -- --id <feature-id> --dry-run
   npm run feature:revert -- --id <feature-id>
   ```

## 完成标准

只有当需求、数据/索引、API、权限、实现、三端配置、迁移与验证均有明确记录且通过对应门禁时，才能宣称“功能完成”。生成页面能打开、开发服务器热刷新或脚本成功退出，都不是业务交付完成的充分条件。

## 参考

- `docs/guides/feature-codegen.md`
- `docs/features/next-react-codegen-template-scheme.md`
- `docs/api-routes.md`
- `docs/guides/rbac-guide.md`
- `AGENTS.md`

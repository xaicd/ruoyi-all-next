# ruoyi-all-next 开发工作手册

更新时间：2026-08-25

本文件是 ruoyi-all-next 的独立开发规范，覆盖架构边界、研发流程、测试门禁、运行部署与交付标准。当前仓库根目录即本项目，命令均在仓库根执行。

## 1. 项目定位

1. ruoyi-all-next 是基于 Next.js 的 RuoYi 能力迁移与复用基座。
2. 目标是以模块化单体方式先完成全域能力吸收，再按域支持独立拆分。
3. 当前阶段坚持“证据驱动迁移”：任何能力声明必须有扫描产物与代码落地。
4. 本仓库同时是新业务项目与 DigitalStaff NPC 员工独立开发的底层模板（Workspace Bundle）。Agent Loop 留在 DigitalStaff；本仓按 DeepSeek Harness 思想做可组合、可追溯进化，见 §18。

## 2. 适用范围与边界

1. 本规范作用于本仓库根目录（即 ruoyi-all-next）。
2. all-next 当前阶段只允许建设 RuoYi 原生域，不接收非原生扩展域。
3. 原生域清单、规模证据、迁移阶段以扫描结果为准。权威运行时清单：`src/modules/shared/backend/constants/domain-catalog.json`。

原生域（15）：

1. system
2. infra
3. bpm
4. pay
5. report
6. mp
7. mall
8. member
9. crm
10. erp
11. wms
12. mes
13. ai
14. iot
15. im

低代码域 `online` 已在 catalog 业务层登记，跨域必须走 Domain Facade，不得直接 import 其他域 Service。`shared` 是核心基础 SDK，不是域、不是微服务。

## 3. 架构总览

### 3.1 分层架构

1. Route 层：`src/app/api/v1/**/route.ts`（另有内部 RPC：`src/app/api/internal/rpc/route.ts` 与开放接口 `src/app/api/v1/open/**`）
2. Service 层：`src/modules/<domain>/backend/services/**`
3. Validator 层：`src/modules/<domain>/backend/validators/**`
4. Page 层（Admin 运营后台 vs CPC 客户/政企 PC 双轨）：
   - Admin 运营后台：`src/app/(admin-pages)/admin/**` + `src/modules/<domain>/frontend/pages/**`
   - CPC 客户/政企/C端 PC：`src/app/(cpc-pages)/cpc/**` + `src/modules/<domain>/frontend/cpc-pages/**`
5. 基座层：`src/modules/shared/backend/constants`、`src/modules/shared/backend/lib`
6. Contract 层：`src/modules/<domain>/contract/`（Facade、actions、proto、route manifest）

### 3.2 目录约束

1. 新增业务域必须落在 `src/modules/<domain>/`。
2. 公共基座（constants/lib/templates）统一放 `src/modules/shared/`。
3. src 下只允许两个顶层目录：app（Next.js路由）和 modules（全部业务+基座）。
4. 禁止在 src 下新建 backend/、frontend/、components/、lib/ 等平铺目录。
5. 通用模板统一放 `src/modules/shared/frontend/templates`。
6. **前端双轨页面规范（强制）**：
   - `src/modules/<domain>/frontend/pages/` 专用于 **Admin 运营管理端页面**；
   - `src/modules/<domain>/frontend/cpc-pages/` 专用于 **Client PC（面向客户、政企内网挂载大盘、C 端员工协同工作台）页面**；
   - 严禁将客户/政企/C 端 PC 页面混入 `frontend/pages/` 中，必须严格收敛在 `frontend/cpc-pages/` 下，实现 Admin 与 Client PC 物理级解耦；
7. C 端与桌面壳必须落在仓库根 `clients/<channel>/`，一渠道一包：`h5`、`uniapp`、`flutter`、`desktop-pc`。
8. 独立客户端包内固定 `app/`、`shared/`、`modules/<domain>/`；域名与 `domain-catalog.json` 一致，禁止把新域堆进 `app`、`shared` 或根 `pages`。细则见 docs/architecture/ruoyi-all-next-client-channels.md。

### 3.3 可替换后端与微服务边界（强制）

1. 对外 HTTP API 必须保持版本化的 `/api/v{n}/` 契约；React 页面只能依赖前端 API Port 与版本化 DTO，禁止依赖 Next Service、Repository、Prisma/Kysely 类型或本地路由实现。
2. 每个可拆分域必须拥有版本化 API Contract、route manifest、application port 与 adapter 边界；Contract 是 TypeScript、Go 及其他实现共享的权威协议，数据库表结构不是浏览器 DTO 的来源。
3. 同域业务调用可使用本地 application port；跨域同步必须走 Domain Facade / `broker.call()` / `serviceBus.call()`（subject=`ruoyi.cmd.<domain>.<method>`），禁止直接 import 其他域 Service 或 Repository。`system` / `infra` **不对业务域整体开放**：业务域只允许调公开面（数据字典 `getDictDataByType`、登录用户信息 `getPermissionInfoByUser`）。其余后台 CRUD 是 BFF 同域 HTTP，不承诺跨域 RPC。`shared` 鉴权走平台面 `resolveTenantEntitlement`。同进程打包时 Facade 走 SDK 内存调用（不序列化）；跨服务独立部署时同一 Facade 切到 RPC，由 `POST /api/internal/rpc` 承载（生产需 `RUOYI_RPC_TOKEN`）。默认远程协议是自研 NATS request-reply + JSON；`RUOYI_RPC_PROTOCOL=grpc` 时走自研 gRPC unary + protobuf frame（无 `@grpc/grpc-js`）。不采用 Dubbo/Thrift 作为默认真源。`shared` 是核心基础 SDK，不是微服务。跨域异步必须走 `broker.emit|broadcast`（subject=`ruoyi.evt.<domain>.<entity>.<action>`）。同步调用必须经过 registry、timeout、retry、bulkhead、circuitBreaker；写命令重试必须带 idempotency。可靠跨域事件必须走 `broker.publishReliable()` / `runUnitOfWork()` + consumer inbox，禁止只靠内存 emit/broadcast。同库同事务 outbox 走 Kysely（无真实库时为可回滚内存事务）；跨库拆分仍属阶段 C。服务间总线使用自研 NATS 语义（inbox / queue group / stream ack），禁止引入 Moleculer、NestJS 或 nats.io 运行时。
4. Next.js Route 在阶段 A/B 是 BFF adapter，不是领域真源；迁移某域到 Go 时，只允许替换该域 upstream adapter / manifest 路由，浏览器 API 路径、DTO、权限、tenant scope 和错误契约不得变化。
5. 新 Go 服务必须验证受信任的服务身份、传递 trace、tenant 与 actor context；禁止信任调用方伪造的 tenant、user 或 permission header。服务间认证、健康/readiness、指标和契约兼容检查是上线前置条件。
6. 以域为独立扩展单元，支持独立构建、部署、水平扩缩、配置和迁移所有权；不得承诺无边界的“无限扩展”，容量目标须由 SLO、压测和资源预算确定。
7. 低代码模板、Codegen ZIP 与 Online 代码下载必须遵守同一双模：生成 Service 可被 broker 调用；跨域走 Domain Facade；同进程 SDK，拆分后 RPC。禁止生成跨域直接 import Service 的代码。Online 预览/下载必须走 `infraPlatformFacade`，不得 import `CodegenEngineService`；字典选项必须走 `systemPublicFacade.getDictDataByType`，不得 import `SystemDictService`。`shared` 鉴权必须走 `systemPlatformFacade.resolveTenantEntitlement`，不得 import `TenantEntitlementService`。

## 4. 编码规范（强制）

### 4.1 Route 薄层

1. Route 只做参数解析、鉴权、调用 Service、统一响应。
2. 禁止在 Route 写业务编排、事务、资源分配。
3. 所有输入必须接 Validator，不允许裸参数直传 Service。

### 4.2 Service 内聚

1. 复杂业务、事务边界、状态机、审计统一放 Service。
2. Service 必须输出结构化日志；关键动作至少 event，敏感动作增加 audit。
3. 跨域调用必须声明超时、重试、幂等策略。

### 4.3 Validator 与契约

1. 所有写接口必须有 schema。
2. 统一错误语义：参数错 400、未登录 401、无权 403、冲突 409、限流 429。
3. API 成功与失败结构统一，禁止同域内响应形状漂移。

### 4.4 权限规范

1. 新增 API 必须使用 permission code。
2. 禁止新增 roles 硬编码作为长期方案。
3. 菜单与页面可见性必须与权限码一致。

### 4.5 日志规范

1. 禁止使用 console.*（测试代码除外）。
2. 关键路径必须记录 event。
3. 审核、权限变更、资金与风控相关操作必须补 audit。
4. 日志禁止输出密码、密钥、token、完整隐私数据。

### 4.6 Service 设计模式规范

1. all-next Service 必须遵循独立模式规范文档。
2. 每个域必须有稳定 Service 门面，子能力按策略/子服务拆分。
3. 涉及状态迁移必须使用状态守卫，禁止无守卫直接写状态。
4. 复杂流程建议统一执行管道：authorize -> guard -> transaction -> log。
5. 规范文档：docs/guides/service-design-patterns.md。

### 4.7 Repository & Service 导出规范与大小写防混淆（强制）

1. 所有 Repository 与 Service 文件，必须同时导出 **PascalCase（类名/对象）** 与 **camelCase（单例别名）**，杜绝消费端因大小写风格差异引发 Turbopack / Next.js 构建错误：
   ```ts
   // 规范示例：aigw-usage.repository.ts
   export const AigwUsageRepository = { ... }
   export const aigwUsageRepository = AigwUsageRepository
   ```
2. 模块级 `repositories/index.ts` 与 `services/index.ts` 集中重导出时，必须同时保留 PascalCase 和 camelCase 导出；
3. 代码生成器（Codegen Engine）模板强制默认输出 camelCase 单例别名。

### 4.8 多租户隔离规范（强制）

**租户来源唯一权威 = 全局上下文 `getCurrentTenantId()`**（`src/modules/shared/backend/lib/biz-tenant.ts`，由 `withAdminRoute` 对每个 admin 请求自动注入 `runWithTenantContext`）。禁止用"显式 tenantId 参数透传"作为长期姿势——透传断链即数据泄露，已在 aigw usages 域实证。

1. **Repository 取租户（强制）**：所有业务表 Repository 在查询（select/update/delete）与写入（insert）时，一律从全局上下文取租户，禁止依赖调用方显式传 `tenantId` 参数。对齐 system 域先例（`user/role/post/dept.repository.ts` 的 `currentTenantId()` helper）：
   ```ts
   import { getCurrentTenantId, isTenantRequired, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"

   function currentTenantId(): string | undefined {
     const tenantId = getCurrentTenantId()
     if (tenantId) return tenantId
     if (isTenantRequired() && !isPlatformContext()) throw new Error("业务数据访问缺少租户上下文")
     return undefined
   }
   // 查询：有值即过滤（真实库 where tenant_id = ?，内存 filter 同语义）
   // 写入：tenant_id 必须取上下文值，禁止硬编码默认租户
   ```
2. **无上下文场景（open/relay/内部任务）**：租户必须从**已验证的资源归属**取（如 relay 从解析出的 API Token 取 `token.tenantId`），禁止落默认值 `"1"`；平台上下文（`isPlatformContext()`）跳过过滤。
3. **内存 Repository 与真实库 Repository 必须同语义**：内存 filter 条件 `(!row.tenantId || row.tenantId === current)` 与真实库 `where tenant_id` 等价，禁止出现"内存不过滤、真实库过滤"或反之。
4. **`TENANT_MODE=required` 生产兜底**：生产环境必须设置，此时缺租户上下文的业务访问直接抛错（`requireTenantId()` / `requireTenantContext()`），把"静默全量返回"变成显性 bug。
5. **低代码生成器（Codegen Engine）与静态模板包（codegen/module-pack）**：生成/示例代码必须遵守第 1-3 条；route 模板必须接收 `(request, auth)` 并把租户传入 Service/Repository，禁止生成断链代码。
6. **禁止项**：禁止业务 Repository 出现无 `tenant_id` 过滤的 select/update/delete；禁止 insert 时 `tenant_id` 硬编码 `"1"` 或 `null`；禁止信任调用方伪造的 `x-tenant-id` Header（必须从已验证 JWT / 资源归属解析）。

## 5. Domain-First 研发流程与“开箱即用”闭环规范（强制）

每个域与新功能按完整闭环推进，**严禁仅生成只读骨架或占位页面（Forbidden Skeleton-Only Delivery）**。

### 5.1 完整六要素交付标准
1. **API 层（Full Verbs）**：必须完整实现 `GET`（分页查询）、`POST`（创建）、`PUT`（更新）、`DELETE`（删除），禁止仅写读接口遗漏写与删。
2. **Service & Repository 层**：必须具备 `page`、`get`、`create`、`update`、`delete` 全套方法，支持多租户隔离与操作审计。
3. **Validator 层**：写操作与查询必须有完整的 Zod Schema 校验。
4. **Page & Component 交互层（禁止只读无按钮页面）**：
   - 必须配备 **顶部操作栏**（`+ 新增` 按钮、刷新、多条件搜索与重置）；
   - 必须配备 **高辨识度状态 Badge**（如 ACTIVE 绿色、DISABLED 灰色）与 Key 复制工具；
   - 必须配备 **表格操作列（Actions）**：至少包含 `[编辑]`、`[启用/禁用]`、`[删除]` 及业务专有按钮（如连通性测试、联调探测）；
   - 必须配备 **新增/编辑弹窗表单（Modal Form）**，支持参数录入与表单校验，确保用户开箱即用。
5. **Permission 权限层**：完整绑定 `VIEW`、`CREATE`、`UPDATE`、`DELETE` 权限码。
6. **Log + Test 层**：至少包含关键路径与 CRUD 自动化测试。

标准推进顺序：
1. 确认域边界与数据模型（多租户 + 审计 6 大字段）。
2. 构建完整的 API、Service、Repository 与 Validator（GET/POST/PUT/DELETE）。
3. 构建完整交互的 Frontend API 与前端管理页面（含操作列与 CRUD 弹窗）。
4. 补齐权限、日志与自动化测试。
5. 门禁检查与文档记录回写。

### 5.2 前端 UI Design System 与低代码 Codegen 模板对齐规范（强制）

所有手动编写与低代码生成器 (Codegen Engine) 产出的前端页面，必须严格遵循平台统一 UI Design System 风格指南（以 `channels.page.tsx` 为视觉基准）：
1. **页面 Header 规范**：
   - 主标题: `text-xl font-bold tracking-tight text-slate-900`
   - 副标题: `text-xs text-slate-500 mt-0.5`
   - 右侧按钮顺序: 【刷新】(白色 `bg-white border-slate-300`) 在左，【+ 新增】(`bg-blue-600 hover:bg-blue-700 text-white`) 在右。
2. **搜索栏 Search Container 规范**：
   - 容器: `p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3`
   - 控件: `bg-slate-900 text-white` 查询按钮 + `bg-slate-100 text-slate-600` 重置按钮
   - 右侧统计: `共 X 个节点/开户` 数据面板。
3. **表格 Table & 操作列 规范**：
   - 表头: `bg-slate-50/80 text-[11px] uppercase text-slate-500 font-semibold tracking-wider`
   - 单元格: `px-5 py-3 text-xs text-slate-600`
   - 操作列: 固定 `text-right whitespace-nowrap min-w-[190px]`，按钮为 `[编辑]` (Blue)、`[启用/停用]` (Amber/Emerald)、`[删除]` (Rose)。
4. **Codegen Engine 低代码模板**：
   - 代码生成器模板 (`src/modules/infra/backend/services/codegen-engine.service.ts`) 与生成脚手架必须硬化使用上述 DOM 结构与 Token，确保生成的代码开箱与原生模版 100% 视觉一致。

## 6. 能力同步与治理门禁

1. 能力状态必须对照 docs/architecture/ruoyi-all-next-capability-matrix.md。
2. 域声明必须同步 docs/architecture/ruoyi-all-next-domain-governance.md。
3. 未登记能力不得标记 DONE。
4. PARTIAL 与 DONE 域必须带 TestRefs。
5. 微服务阶段为 B/C 的域必须填写 SplitNote。

CI 前置检查：

1. npm run ruoyi:matrix:check
2. npm run ruoyi:governance:check
3. npm run domain:check
4. npm run microservice:check
5. 合并前建议执行 strict：
	- npm run ruoyi:matrix:check:strict
	- npm run ruoyi:governance:check:strict

一键门禁：`npm run check`（含 matrix、governance、domain、microservice）。

## 6.1 多模型三阶段协作规范（强制）

为杜绝多模型协同过程中的越权修改、规格漂移与虚假测试，全平台严格贯彻「规划 -> 开发 -> 独立测试」不可逾越的三阶段流水线与门禁铁律：

### 1. 规划阶段 (Planning Phase)
- **定位**：由 Pro / 高推理模型主导，严禁直接编写产品代码；
- **产物**：必须完整产出 `requirements.md`、`design.md`、`tasks.md`；
- **状态收敛**：`PLAN_APPROVED`；
- **声明权限**：只能声明“规划完成，可进入开发”，严禁越权声明已实现。

### 2. 开发阶段 (Development Phase)
- **定位**：严格按照已冻结的规格和任务 DAG 实现；
- **交付内容**：必须提供候选 Commit SHA、精确变更范围、开发自测记录和风险说明；
- **状态收敛**：`DEV_READY`；
- **声明权限**：只能声明“开发完成，等待独立测试”，严禁自行宣布测试通过或上线。

### 3. 独立测试阶段 (Independent Testing Phase)
- **定位**：针对不可变候选 SHA 进行独立客观验收；
- **判定结果**：限定为 `PASS` / `CONDITIONAL` / `FAIL` / `BLOCKED` 四种状态；
- **状态收敛**：`TEST_PASSED`；
- **自愈回归**：若修改任何产品代码，必须生成新的候选 SHA 并重新执行完整测试矩阵。

### 4. 门禁与协作铁律
1. **权威推导链**：`requirements.md` → `design.md` → `tasks.md` 为唯一权威单向推导链，规格变化必须退回规划阶段，严禁开发模型暗改需求；
2. **测试隔离**：开发自测绝对不能替代独立测试；单个 `[x]` 严禁同时代表实现、测试和上线；
3. **状态真源**：项目阶段状态以 `project-status.md` 为准，正式发布状态只看 `CURRENT.md`；
4. **发布审批门禁**：`RELEASE_APPROVED` 属于三阶段之后的人工/运维门禁，不属于测试模型自动权限；
5. **提交与推送授权**：规划、开发、测试模型默认不得擅自提交或推送，必须经过授权和阶段门禁；
6. **交接六要素**：跨模型交接必须完整记录 **SHA、变更范围、开发验证、风险说明、环境限制、下一阶段入口**。

## 6.2 Skill Registry（强制）

以下 Skill 为 all-next 的治理必备项，AGENTS 必须注册并在对应场景启用：

1. new-feature：.agents/skills/new-feature/SKILL.md
2. database-compatibility：docs/skills/ruoyi-all-next/database-compatibility.SKILL.md
3. ui-framework-governance：docs/skills/ruoyi-all-next/ui-framework-governance.SKILL.md
4. microservice-evolution：docs/skills/ruoyi-all-next/microservice-evolution.SKILL.md
5. ui-ux-pro-max：.kiro/steering/ui-ux-pro-max/SKILL.md
6. agent-harness：.agents/skills/agent-harness/SKILL.md

启用规则：

1. 涉及新增功能、业务模块扩展或新表落地时，**必须强制启用 new-feature**，执行 RBAC 权限、全动词 API、单行 UI 规范与 CRUD 弹窗一体化交付。
2. 涉及数据库选型、兼容等级或迁移时，启用 database-compatibility。
3. 涉及页面模板、组件结构或交互规范时，启用 ui-framework-governance + ui-ux-pro-max。
4. 涉及域拆分、独立发布或阶段演进时，启用 microservice-evolution。
5. 涉及 C 端页面、视觉设计、UX 交互或前端组件开发时，必须启用 ui-ux-pro-max。
6. 涉及新业务项目孵化、DigitalStaff NPC 模板、DeepSeek Harness 学习或基座智能进化时，启用 agent-harness。


## 7. 扫描与迁移节奏（证据驱动）

推荐每个批次都执行以下命令链：

1. npm run ruoyi:full:scan
2. npm run ruoyi:deep:scan
3. npm run ruoyi:mini:scan
4. npm run ruoyi:migration:board

产物目录：docs/architecture/artifacts/

迁移节奏：

1. P0-Foundation：system + infra 先闭环
2. P1-CloseGaps：已有骨架域补齐日志与测试
3. P2-Bootstrap：从 0 到 1 建立域骨架
4. P3-NewDomain：TODO 域按六要素启动

## 8. 测试规范

1. 每个新域至少补 1 条关键路径自动化测试。
2. 涉及日志规范时必须有 log/audit 断言。
3. 涉及权限边界时必须有拒绝路径测试。
4. 涉及事务时必须有失败回滚测试。

建议命令：

1. npm test -- --run src/modules/infra/backend/services/__tests__/template-engine.service.test.ts
2. npm test -- --run src/modules/shared/backend/lib/__tests__/rpc-protocol.test.ts
3. npm test -- --run src/modules/infra/backend/services/__tests__/codegen-engine.rpc.test.ts
4. npm test

## 9. 本地开发与运行步骤

说明：命令统一在仓库根目录执行。

一键入口（推荐）：

1. npm run quick-start

该入口会自动执行基础设施启动、数据库初始化、治理检查与开发服务器启动。

### 9.1 首次启动

1. 首次初始化：npm run init
2. 门禁检查：npm run check
3. 启动应用：npm run dev

### 9.2 all-next 研发常用命令

1. 能力扫描：npm run ruoyi:full:scan
2. 证据扫描：npm run ruoyi:deep:scan
3. mini 基座扫描：npm run ruoyi:mini:scan
4. 迁移作战板：npm run ruoyi:migration:board
5. 治理检查：npm run check
6. strict 治理：npm run ruoyi:matrix:check:strict && npm run ruoyi:governance:check:strict
7. 域独立打包：npm run domain:list && npm run domain:pack -- pay
8. 一体运行：npm run dev（或 npm run runtime:all）
9. 域独立运行：npm run domain:dev -- pay
10. 拆分部署（BFF + pay，Facade RPC）：npm run runtime:split 或 npm run domain:up -- pay
11. 域 RPC 契约：npm run domain:contracts（生成 TS Facade / proto / gen/go 桩）
12. 微服务治理门禁：npm run microservice:check
13. 全域初始化与最新 SQL 编译（唯一官方标准入口）：`npm run build:init-sql`（对应 `scripts/build-v1-init-sql.ts`，严禁编写临时 scratch 导出脚本！）

本地命令面（package.json）：

1. npm run quick-start
2. npm run check
3. npm run build:init-sql  (编译最新官方全量 PostgreSQL V1.0.0 初始化 SQL)
4. npm run project:create -- <目标路径>  (一键孵化新工程与独立数据库)
5. npm run scaffold
5. npm run domain:list
6. npm run domain:up -- pay


### 9.3 本地验证最小闭环

1. 打开 /admin/system、/admin/infra 与当前域页面。
2. 验证列表、筛选、分页、详情、保存等核心路径。
3. 校验无权限用户访问被正确拒绝。

## 10. 构建与部署步骤

### 10.1 预发/生产构建

1. npm run lint
2. npm test
3. npm run build
4. npm run start  # 运行 `.next-ruoyi/standalone/server.js`，验证生产构建

### 10.2 Docker 部署

1. 一体镜像：docker build -t ruoyi-all-next .
2. 域镜像：docker build -f Dockerfile.domain -t ruoyi-all-next-domain .
3. 生产编排：docker compose -f deploy/docker-compose.prod.yml up -d
4. 开发编排：docker compose -f deploy/docker-compose.dev.yml up -d
5. 拆分编排（BFF + 域）：npm run domain:up -- pay

详见 deploy/README.md。

### 10.3 发布门禁

1. 发布前必须通过 strict 治理检查。
2. 发布前必须生成最新扫描证据与迁移作战板。
3. 发布前必须同步文档索引：npm run docs:sync-context。

## 11. 代码规模与拆分约束

1. 单模块包含 3 个以上子能力时，Service 与 Validator 必须目录化拆分。
2. 单文件超过 200 行优先拆分为子服务并保留门面入口。
3. 新开发禁止继续向兼容门面堆业务代码。
4. 域稳定后应具备独立拆分为 app/service 的最小条件。

## 12. 常见禁止项

1. 禁止绕过 Validator 直连 Service。
2. 禁止在 Route 写事务。
3. 禁止未登记能力宣称完成。
4. 禁止只做页面不补权限与测试。
5. 禁止输出无审计证据的高风险变更。

## 13. 参考文档

1. README.md
2. src/modules/README.md
3. docs/architecture/ruoyi-native-capabilities-catalog.md
4. docs/architecture/ruoyi-full-migration-board.md
5. docs/architecture/system-core-implementation-checklist.md
6. docs/architecture/ruoyi-all-next-capability-matrix.md
7. docs/architecture/ruoyi-all-next-domain-governance.md
8. docs/guides/api-route-conventions.md
9. docs/guides/tenant-catalog-bootstrap.md
10. docs/guides/service-design-patterns.md
11. scripts/quick-start.sh
12. scripts/scaffold-feature.ts
13. docs/architecture/ruoyi-all-next-domain-pack.md
14. docs/architecture/ruoyi-all-next-messaging-constraints.md
15. docs/architecture/ruoyi-all-next-microservice-governance.md
16. docs/architecture/ruoyi-all-next-module-rpc.md
17. deploy/README.md
18. docs/architecture/ruoyi-all-next-client-channels.md
19. docs/guides/project-profile-bootstrap.md
20. docs/architecture/ruoyi-all-next-harness-evolution.md

## 14. 代码生成器架构规范

### 14.1 生成器入口

- 引擎：`src/modules/infra/backend/services/codegen-engine.service.ts`
- 前端页面：`/admin/infra/codegen`
- API：`/api/v1/admin/infra/codegen`（导入表、预览、下载 ZIP）
- 注入脚本：`scripts/inject-codegen-output.cjs`

### 14.2 生成产物目录结构

代码生成器对每张表输出以下文件，严格遵循 modules-first 分层：

```
src/modules/{domain}/
├── contract/
│   └── {kebab}.actions.ts            ← ACTION_SCHEMAS（HTTP 与 broker 共用）
├── backend/
│   ├── types/{kebab}.types.ts        ← DO/VO/CreateInput/UpdateInput/PageQuery
│   ├── validators/{kebab}.validator.ts ← Zod Schema (create/update/pageQuery)
│   ├── repositories/{kebab}.repository.ts ← Kysely 真实库 + 内存回退
│   ├── services/{kebab}.service.ts    ← Service（调本域 Repository；托管表走 onlineFacade）
│   ├── services/{kebab}.rpc.ts        ← 双模 RPC binding（同进程 SDK / 拆分 RPC）
│   └── services/__tests__/{kebab}.service.test.ts ← Vitest 测试
├── frontend/
│   ├── api/{kebab}.api.ts            ← 前端 API 封装 (page/get/create/update/delete)
│   ├── components/{ClassName}Form.tsx ← 弹窗表单组件
│   └── pages/{kebab}-list.page.tsx   ← 列表页 (搜索+表格+分页+CRUD)
src/app/
├── api/v1/admin/{domain}/{kebab}/route.ts       ← API Route (GET/POST/PUT/DELETE)
└── (admin-pages)/admin/{domain}/{kebab}/page.tsx ← App Router 入口
```

### 14.3 路径约束（强制）

1. 后端文件必须在 `modules/{domain}/backend/` 下，禁止放 `modules/{domain}/services/` 平铺。
2. 前端文件必须在 `modules/{domain}/frontend/` 下，api/components/pages 三级分离。
3. API Route 路径：`src/app/api/v1/admin/{domain}/{kebab}/route.ts`。
4. App 页面入口：`src/app/(admin-pages)/admin/{domain}/{kebab}/page.tsx`。
5. 类型 import 使用 `@/modules/{domain}/backend/` 前缀，禁止相对路径跨层。

### 14.4 前端模板规范（对标 RuoYi Vue3）

| 模板 | 职责 | 对标 Vue3 |
|---|---|---|
| `api/{kebab}.api.ts` | request 封装，暴露 page/get/create/update/delete | `src/api/system/user.ts` |
| `components/{ClassName}Form.tsx` | 弹窗表单（新增/编辑复用） | `views/system/user/UserForm.vue` |
| `pages/{kebab}-list.page.tsx` | 列表页（搜索+表格+分页） | `views/system/user/index.vue` |

### 14.5 注入与加载流程

```bash
# 1. 在 /admin/infra/codegen 页面导入表 → 预览 → 下载 ZIP
# 2. 解压到 tmp/ 目录
# 3. 先在临时目录审阅清单与源码，再受控注入（默认遇到冲突即失败，不覆盖）
node scripts/inject-codegen-output.cjs tmp/codegen-{ClassName} --dry-run
node scripts/inject-codegen-output.cjs tmp/codegen-{ClassName}
# 4. Next.js hot reload 自动检测新文件 → 浏览器刷新可用
# 5. 侧边栏动态加载：GET /api/v1/admin/system/menus/sidebar
```

### 14.6 生成器禁止项

1. 禁止覆盖已有 Service/Repository/Page（inject 脚本会跳过 exists 文件）。
2. 禁止生成 `modules/{domain}/services/` 路径（必须是 `backend/services/`）。
3. 禁止前端页面直接 fetch，必须通过 `api/{kebab}.api.ts` 封装。
4. 禁止生成不带 Zod Validator 的 API Route。

### 14.7 种子数据位置

- 种子数据统一放 `prisma/data/`，通过 `@prisma/data` alias import。
- 各 Repository 通过 `import { SEED_XXX } from "@prisma/data"` 初始化 MEMORY_STORE。
- 生成脚本：`scripts/inject-seed-to-repositories.cjs`。


### 15. User Conversation & Requirement Logging (MANDATORY)

**所有用户对话输入与需求内容必须实时记录汇总：**
- 任何 AI Agent / IDE（Antigravity、Cursor、Windsurf、Claude Code、Copilot、Kiro、Trae、Codex 等）在接收到用户的每次对话输入与需求时，**必须**将用户的原始输入内容完整记录并追加汇总到 `docs/features/sprint-prod/{MMDD}.md`（例如 8月17日记录到 `docs/features/sprint-prod/0817.md`）。
- 保持需求序号递增与用户输入的完整性，确保需求历史与上下文严格可追溯。

### 16. ProjectReactor 脚手架与 GitHub Template 规范（供 DigitalStaff AI NPC 员工与全自动工程孵化）

**作为 GitHub Template 模板底座的权威一键生成机制：**
- 当 `DigitalStaff` AI NPC 员工或开发者需要以此底座衍生创建新业务工程时，统一调用：
  ```bash
  npm run project:create -- <目标路径>
  npm run project:create -- <目标路径> --profile minimal
  npm run project:create -- <目标路径> --profile vertical --bundle mall,crm
  # 或直接运行：create-project.bat <目标路径> --profile minimal
  ```
  - `standard`（默认）：整仓原生域，数字工厂全能力模板。
  - `minimal`：shared + system + infra + 平台伴生域 `online/ai/aigw`（菜单目录与 codegen Facade 依赖，不能裁）。
  - `vertical`：minimal + `--bundle` 业务域白名单。
  - `creator`：等同 standard（含 online/codegen）。
  - 产物写入 `src/modules/shared/contract/hatch-manifest.json`。Prisma 迁移仍为全量基座表。
- **自动化工作流水线（全托管零配置）：**
  1. **反应堆克隆与包名重塑**：自动将 `ruoyi-all-next` 转换为目标工程名，重塑 `package.json`（自动分配独立 `PORT=3200` 避开冲突）；
  2. **二进制防损坏保护**：图片、字体、压缩包与数据库 dump 文件走二进制流白名单拷贝，绝不进行文本正则替换；
  3. **数据库物理隔离与全量就绪**：自动连接 PostgreSQL 服务，创建目标独立数据库（如 `agent_zqall`），并默认部署全量 27 项基准 SQL 迁移与 RBAC 菜单权限；
  4. **目标设计文档保护**：自动识别并完好保留目标目录下已有的业务规格文档（如 `应算通-*`、`*.md`），严禁覆盖用户既有设计；
  5. **开箱即用**：产出工程可直接通过 `start.bat` / `./start.sh` 一键运行，无需人工执行初始化 SQL！后续有新表结构变更仅需执行增量 `npm run db:migrate`。

### 17. 目录职责划分与基座/业务边界规范（Core Base vs Business Domain）

为了保证业务工程（如 `agent-zqall`）与通用基座（`ruoyi-all-next`）之间既能**独立演进**，又能**通过版本化升级平滑同步底座能力与双向反哺功能**，严格执行以下目录与边界规范：

#### 17.1 目录职责分类矩阵

| 目录属性 | 包含文件与路径 | 职责定位与变更权限 | 升级与反哺规则 |
|---|---|---|---|
| 🟢 **业务开发区<br>(Business Zone)** | • `src/modules/<domain>/`<br>• `src/app/api/v1/admin/<domain>/`<br>• `src/app/(admin-pages)/admin/<domain>/`<br>• `clients/<channel>/modules/<domain>/` | **具体业务开发区域**。<br>包含业务 DTO、Validator、Repository、Service、前端页面与弹窗组件。按域完全自包含。 | **单模块热拔插移植**：将业务域移植回基座时，按「五要素清单」整包拷贝，不影响其他业务域。 |
| 🛡️ **基座公共内核<br>(Core Base Zone)** | • `src/modules/shared/`<br>• `src/modules/system/` (公开面外)<br>• `src/modules/infra/` (公开面外)<br>• `scripts/`, `deploy/`, `prisma/data/` | **通用技术底座与公共 SDK**。<br>包含通信总线、RBAC 鉴权、签名加密、Kysely 引擎、Docker 编排。 | **基座版本化升级（Base Upgrade）**：通过基座版本升级统一更新，严禁在业务开发中向 `shared` 堆砌业务逻辑。 |
| 📋 **全局路由与契约<br>(Registry Zone)** | • `src/modules/shared/backend/constants/domain-catalog.json`<br>• `src/modules/shared/backend/constants/permissions.ts`<br>• `prisma/schema.prisma` | **全局权威契约与数据模型**。<br>记录系统全部合法域、RBAC 权限白名单与 Prisma 模型。 | **追加式维护（Append-Only）**：新业务仅可在此追加条目，严禁破坏既有数据字典与权限语义。 |

#### 17.2 业务功能反哺与移植「标准五要素清单」（The 5-Element Porting Package）

当衍生业务工程孵化出通用功能并需移植回基座时，仅需同步以下 5 项：
1. **模块目录**：`src/modules/{domain}/`（前后端业务代码与 Contract）
2. **Next.js 路由**：`src/app/api/v1/admin/{domain}/` 与 `src/app/(admin-pages)/admin/{domain}/`
3. **数据库增量迁移**：`prisma/migrations/2026MMDD000000_{feature}/` 与 `prisma/schema.prisma` 新增模型
4. **权限码追加**：`src/modules/shared/backend/constants/permissions.ts`
5. **Catalog 登记**：`src/modules/shared/backend/constants/domain-catalog.json`

#### 17.3 移植合规门禁三步法
```bash
# 1. 部署增量迁移
npm run db:migrate

# 2. 重新生成 RPC 与路由 Manifest
npm run domain:contracts
npm run domain:manifests

# 3. 执行全量合规与单元测试检查
npm run check
```

### 18. Harness 进化规范（DeepSeek Harness 思想 × DigitalStaff NPC 模板）

本仓库是 **Workspace Bundle**（业务工程模板），不是 Agent 运行时。公式：`NPC = Model + DigitalStaff Native + 本仓库`。

1. **学思想，不搬框架**：吸收插件化域、Capability Seam、Profile/Bundle/Patch、Prompt 分段组装、可追溯轨迹。禁止引入 Cordis、禁止在 `src/` 实现 Agent Loop、禁止运行时自挂载插件。
2. **机器可读入口**：`src/modules/shared/contract/agent-profile.json`。域名真源仍是 `domain-catalog.json`。
3. **提示分段**：`.agents/context/ASSEMBLY.md`。禁止把本文件整篇灌进每一次模型请求。
4. **NPC 孵化**：只允许 `npm run project:create -- <目标路径>`；身份只改 `project-profile.json` 与 `public/branding/`。
5. **后期进化**：P1 `--profile/--bundle`、P2 seam 图、P3 门禁轨迹已落地；P4 由 DigitalStaff 读取本仓 `agent-profile.json`。细则见 `docs/architecture/ruoyi-all-next-harness-evolution.md`。

### 19. 严禁 Token 浪费、零重复代码与“工具先行”低代码架构铁律 (MANDATORY Zero Waste & Tool-First Architecture)

**本模板工程坚决贯彻极简工程哲学，严禁任何形式的 Token 浪费、重复造轮子与生成无意义冗余样板代码：**
- **严禁 Token 与算力浪费 (Zero Token Waste)**：
  - 严禁大模型人肉逐行生成几百行千篇一律的重复 CRUD、样板代码、冗余 DDL 或静态 HTML 骨架；
  - 业务开发与需求实现必须采用 **Schema / DSL 极简声明式驱动**（将大模型输出压缩至 <500 Tokens），由底层通用引擎与脚手架工具自动展开；
- **架构模式极致复用 (Architectural Pattern Mastery)**：
  - **持久层**：必须复用泛型 `BaseMapper<T>`、`QueryWrapper<T>` 与 `BaseService<T>`，自动获得多租户隔离、逻辑删除与 8 大基础审计底座字段，严禁手写重复 SQL/CRUD；
  - **测试层**：必须复用 `TestingKit` 与 4 层金字塔自动化脚手架，严禁复制粘贴重复的 Mock 环境初始化逻辑；
  - **微服务与跨域**：跨域调用统一走 `Domain Facade` 与自研服务总线，严禁破坏模块隔离；
- **存量低代码工具优先 (Prioritize Existing Low-Code Tooling)**：
  - 在编写任何新业务代码前，必须先检索并优先使用模板内已有域能力、脚手架工具（`scripts/scaffold-feature`）、CRUD 生成器与内置 Skills；
- **缺少工具就造工具 (Build Tools When Missing)**：
  - 遇到可抽象的高频业务或研发需求，必须优先沉淀为通用工具与生成脚本，让工具自动化执行，**绝不能重复手写无效、低效、无意义代码**；
  - 沉淀的高价值工具必须结晶沉淀为标准资产，实现“一次造工具，后续业务开发永久受益”；
- **开源成熟方案优先与竞品性价比选型 (Open-Source First & Best ROI Selection)**：
  - **严禁盲目从零造轮子**：若自研工具周期过长、复杂度过高或 Token 消耗过大，必须**优先检索开源成熟方案与工业级类库/工具**；
  - **多维竞品横评**：主动从成熟度、轻量性、维护活跃度、Token 消耗比与 License 兼容性进行客观竞品分析；
  - **遴选最高性价比解法**：选择综合 ROI（性价比）最高、改造成本最小的最佳开源方案进行集成适配，实现极致工程效能。

<!-- BEGIN:nextjs-agent-rules -->



# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

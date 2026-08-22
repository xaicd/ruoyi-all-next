# ruoyi-all-next 开发工作手册

更新时间：2026-08-20

本文件是 ruoyi-all-next 的独立开发规范，覆盖架构边界、研发流程、测试门禁、运行部署与交付标准。当前仓库根目录即本项目，命令均在仓库根执行。

## 1. 项目定位

1. ruoyi-all-next 是基于 Next.js 的 RuoYi 能力迁移与复用基座。
2. 目标是以模块化单体方式先完成全域能力吸收，再按域支持独立拆分。
3. 当前阶段坚持“证据驱动迁移”：任何能力声明必须有扫描产物与代码落地。

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

1. Route 层：`src/app/api/v1/**/route.ts`（另有内部 RPC：`src/app/api/internal/rpc/route.ts`）
2. Service 层：`src/modules/<domain>/backend/services/**`
3. Validator 层：`src/modules/<domain>/backend/validators/**`
4. Page 层：`src/app/(admin-pages)/admin/**` + `src/modules/<domain>/frontend/pages/**`
5. 基座层：`src/modules/shared/backend/constants`、`src/modules/shared/backend/lib`
6. Contract 层：`src/modules/<domain>/contract/`（Facade、actions、proto、route manifest）

### 3.2 目录约束

1. 新增业务域必须落在 `src/modules/<domain>/`。
2. 公共基座（constants/lib/templates）统一放 `src/modules/shared/`。
3. src 下只允许两个顶层目录：app（Next.js路由）和 modules（全部业务+基座）。
4. 禁止在 src 下新建 backend/、frontend/、components/、lib/ 等平铺目录。
5. 通用模板统一放 `src/modules/shared/frontend/templates`。

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

## 5. Domain-First 研发流程

每个域按六要素推进，不允许跳步宣称完成。

1. API
2. Service
3. Validator
4. Page
5. Permission
6. Log + Test

标准顺序：

1. 先读扫描证据与迁移作战板，确认域边界。
2. 用模板生成最小闭环骨架。
3. 补齐权限、日志与关键路径测试。
4. 回写文档与矩阵状态。

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

## 6.1 Skill Registry（强制）

以下 Skill 为 all-next 的治理必备项，AGENTS 必须注册并在对应场景启用：

1. database-compatibility：docs/skills/ruoyi-all-next/database-compatibility.SKILL.md
2. ui-framework-governance：docs/skills/ruoyi-all-next/ui-framework-governance.SKILL.md
3. microservice-evolution：docs/skills/ruoyi-all-next/microservice-evolution.SKILL.md
4. ui-ux-pro-max：.kiro/steering/ui-ux-pro-max/SKILL.md

启用规则：

1. 涉及数据库选型、兼容等级或迁移时，启用 database-compatibility。
2. 涉及页面模板、组件结构或交互规范时，启用 ui-framework-governance + ui-ux-pro-max。
3. 涉及域拆分、独立发布或阶段演进时，启用 microservice-evolution。
4. 涉及 C 端页面、视觉设计、UX 交互或前端组件开发时，必须启用 ui-ux-pro-max。

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

本地命令面（package.json）：

1. npm run quick-start
2. npm run check
3. npm run scaffold
4. npm run domain:list
5. npm run domain:up -- pay

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

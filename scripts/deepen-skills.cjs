const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'docs', 'skills', 'ruoyi-all-next');
const dstDir = path.join(__dirname, '..', '.agents', 'skills');

const skillsData = {
  'product-requirements': `---
name: product-requirements
description: 需求与原型收敛。新功能、多端、业务项目初始化、空客户端补齐前先启用。
---

# 需求原型与产品设计规范

## 1. 适用场景与触发条件
- 用户提出新功能、业务域扩展或定制化业务需求时。
- 初始化新客户端（H5、UniApp、Flutter、Desktop-PC）或落地多端统一功能时。
- 需求描述模糊，需收敛范围、状态机、多租户边界或验收标准时。

## 2. 权威依据
- \`AGENTS.md\` §2 (15 原生域边界与定位)
- \`AGENTS.md\` §5 (Domain-First 研发流程六要素)
- \`AGENTS.md\` §15 (用户对话与需求必须实时记录至 \`docs/features/sprint-prod/{MMDD}.md\`)
- \`docs/guides/project-profile-bootstrap.md\` (品牌与项目元数据引导)
- \`docs/architecture/ruoyi-all-next-client-channels.md\` (多端渠道标准)
- \`docs/architecture/ruoyi-all-next-capability-matrix.md\` (能力矩阵权威清单)

## 3. 标准需求收敛六要素模板

每个需求产物必须完整包含以下 6 个维度：

\`\`\`markdown
### 1. 业务背景与用户画像 (5W1H)
- 谁 (Who)：管理员 (Admin) / 普通会员 (Member) / 匿名访客 (Guest)
- 在哪 (Where)：admin-web / h5 / uniapp / flutter / desktop-pc
- 做什么 (What)：业务核心目标与操作路径
- 为什么 (Why)：业务价值与解决痛点

### 2. 渠道与客户端支持矩阵
- [ ] Admin Web (Next.js 管理后台)
- [ ] H5 移动端 (React + Vite)
- [ ] UniApp (Vue3 + TS 小程序/跨端)
- [ ] Flutter (移动原生 App)
- [ ] Desktop-PC (Tauri / Electron 桌面端)

### 3. API 面与权限隔离
- 接口分类：\`admin\` (/api/v1/admin) | \`app\` (/api/v1/app) | \`open\` (/api/v1/open)
- 权限标识码：\`<domain>:<entity>:<action>\` (例如 \`mall:goods:create\`)

### 4. 业务状态机与流转矩阵
| 当前状态 | 触发动作 | 目标状态 | 权限/角色 | 附加条件/校验 |
|---|---|---|---|---|
| DRAFT | SUBMIT | PENDING | 创建人 | 必填项完整 |
| PENDING | APPROVE | APPROVED | 审批人 | 具备审批权限 |
| PENDING | REJECT | REJECTED | 审批人 | 填写驳回原因 |

### 5. 验收标准 (Given-When-Then)
- 场景 1（正向路径）：Given 正常参数，When 提交保存，Then 创建成功并记录审计日志。
- 场景 2（权限拒绝）：Given 未授权用户，When 发起请求，Then 返回 403 Forbidden。
- 场景 3（异常回滚）：Given 仓储层写失败，When 事务抛错，Then 数据完整回滚无残留。

### 6. 非目标与边界 (Non-Goals)
- 明确本期迭代不做的事项，防止范围蔓延。
\`\`\`

## 4. 检查清单 (Checklist)
1. [ ] 用户原始对话已追加至 \`docs/features/sprint-prod/{MMDD}.md\`。
2. [ ] 涉及的业务域在 15 原生域（\`domain-catalog.json\`）之内，无随意发明新域。
3. [ ] 明确了跨端渠道归属与端侧 API 契约面。
4. [ ] 状态机迁移规则具备前置条件和守卫判断。

## 5. 绝对禁止项
- 禁止将草稿原型直接当作 API 与数据库真源。
- 禁止为了“赶进度”跳过权限定义与验收标准。
- 禁止客户端直接依赖后端私有 Service 或数据表结构。
`,

  'ui-design': `---
name: ui-design
description: 管理端与 C 端 UI/UX 设计。画页面、改布局、做多端适配时启用。
---

# UI/UX 设计与前端组件规范

## 1. 适用场景
- 开发管理端（Admin Web）列表页、详情页、配置表单或仪表盘。
- 开发 C 端与移动端（H5、UniApp、Flutter、Desktop PC）页面与交互。
- 调整系统主题、排版、色彩 Token、微动效与响应式布局。

## 2. 权威依据
- \`AGENTS.md\` §3.2 (客户端包结构约束：\`clients/<channel>/src/{app,shared,modules/<domain>}\`)
- \`AGENTS.md\` §4.4 (权限与菜单可见性一致性)
- \`AGENTS.md\` §6.1 (UI Framework 与 UI-UX-Pro-Max 治理规范)
- \`AGENTS.md\` §14.4 (前端模板与对标规范)
- \`docs/architecture/ruoyi-all-next-client-channels.md\` (渠道规范)
- \`src/modules/shared/frontend/templates\` (通用管理端模板)

## 3. 设计系统规范与色彩 Token
- **严禁使用刺眼的纯原色与杂乱渐变**，必须使用遵循 HSL 色彩空间的高质感调色板：
  - \`Primary\`: 沉稳科技蓝 / 雅致主色
  - \`Success\`: 自然柔和绿
  - \`Warning\`: 琥珀暖橙
  - \`Danger\`: 砖红 / 珊瑚红
  - \`Neutral\`: 层次清晰的灰阶体系（Background / Card / Border / Text）
- **现代化 UI 质感要求**：
  - 微拟物与毛玻璃（Glassmorphism，适度 \`backdrop-filter: blur\`)
  - 细腻的多层柔和投影（\`box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05)\`）
  - 120ms~200ms 的平滑过渡动效（Ease-out 贝塞尔曲线）

## 4. 管理端标准三段式布局
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ 1. 顶部检索区 (SearchForm: 关键词/状态/下拉/重置/查询按钮)     │
├─────────────────────────────────────────────────────────────┤
│ 2. 工具栏区 (Toolbar: 新增/批量删除/导出/列显隐/刷新)          │
├─────────────────────────────────────────────────────────────┤
│ 3. 数据表格区 (DataTable: 排序/选择/字段展示/行操作按钮)       │
├─────────────────────────────────────────────────────────────┤
│ 4. 分页控制区 (Pagination: 总数/每页条数/页码跳转)            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## 5. 多端交互状态完备性 (4 态必齐)
任何列表或异步组件必须覆盖以下四种状态：
1. **Loading 态**：使用骨架屏（Skeleton）或平滑 Spinner，禁止白屏。
2. **Empty 态**：图文结合的空状态提示，并提供快速“创建/重试”引导按钮。
3. **Error 态**：友好错误提示文案，支持一键重试，不抛出底层红屏堆栈。
4. **Success 态**：数据优雅渲染，操作成功附带轻量 Toast / Notification 反馈。

## 6. 绝对禁止项
- 禁止在页面中直接写死品牌名称或 Logo，必须从 \`GET /api/v1/open/meta/project-profile\` 读取。
- 禁止 C 端页面直接套用臃肿的桌面后台表格。
- 禁止按钮无 \`cursor: pointer\`，禁止可交互元素缺失 hover / focus / active 反馈。
`,

  'api-design': `---
name: api-design
description: 版本化 HTTP/RPC 契约。新增或修改 API、DTO、OpenAPI、客户端对接时启用。
---

# API 契约与接口设计规范

## 1. 适用场景
- 新增或修改对外 HTTP 接口（Admin/App/Open）。
- 定义领域 DTO、Zod 校验 Schema 与 OpenAPI 文档。
- 定义微服务跨域 RPC / Proto / Facade 契约。

## 2. 权威依据
- \`AGENTS.md\` §3.1 (分层架构契约)
- \`AGENTS.md\` §3.3 (可替换后端与版本化契约边界：对外 HTTP 统一 \`/api/v{n}/\`)
- \`AGENTS.md\` §4.1 (Route 薄层约束：参数解析、鉴权、调 Service、统一响应)
- \`AGENTS.md\` §4.3 (Validator 与错误码契约)
- \`docs/guides/api-route-conventions.md\`
- \`docs/specs/api-security-persistence-spec.md\`

## 3. API 分面与路由前缀规范

| 面 | 路径前缀 | 目标终端 | 鉴权机制 |
|---|---|---|---|
| **Admin** | \`/api/v1/admin/<domain>/<resource>\` | 管理后台 | Admin JWT + Permission Code (\`hasPermission\`) |
| **App** | \`/api/v1/app/<domain>/<resource>\` | H5 / 小程序 / App | Member JWT (\`requireMemberAuth\`) |
| **Open** | \`/api/v1/open/<domain>/<resource>\` | 第三方 / 开放平台 | API Key / HMAC 签名 + Nonce |
| **Internal** | \`/api/internal/rpc\` | 服务间 RPC | \`RUOYI_RPC_TOKEN\` (外部网络严格隔离) |

## 4. 统一 HTTP 响应封套与状态码契约

所有 HTTP 接口必须返回统一 JSON 结构：

\`\`\`typescript
export interface ApiResponse<T = any> {
  code: number          // 0 为成功，非 0 为错误码 (如 40001, 40100)
  data: T               // 业务载荷
  msg: string           // 用户提示信息
  traceId?: string      // 链路追踪标识
}
\`\`\`

### HTTP 语义状态码规范：
- \`200 OK\`：成功请求。
- \`400 Bad Request\`：输入参数校验失败（Zod 抛出字段级 issues）。
- \`401 Unauthorized\`：未登录、Token 过期或签名无效。
- \`403 Forbidden\`：已登录但无此资源的操作权限码。
- \`404 Not Found\`：目标实体不存在。
- \`409 Conflict\`：唯一键冲突、状态机流转冲突或并发乐观锁冲突。
- \`429 Too Many Requests\`：触发分布式限流或防刷规则。
- \`500 Internal Server Error\`：服务端未捕获异常（记录详细 Error 日志）。

## 5. Zod Schema 强契约规范
所有写操作（POST / PUT / PATCH / DELETE）必须定义对应的 Zod Schema，禁止裸 body 传入 Service：

\`\`\`typescript
export const userCreateSchema = z.object({
  username: z.string().trim().min(3).max(30),
  nickname: z.string().trim().min(1).max(50),
  email: z.string().email().optional(),
  mobile: z.string().regex(/^1[3-9]\\d{9}$/, "手机号格式不正确").optional(),
  deptId: z.string().optional(),
  roleIds: z.array(z.string()).min(1, "至少分配一个角色"),
})
\`\`\`

## 6. 绝对禁止项
- 禁止为特定客户端单独开设 \`/api/h5/\` 或 \`/api/uniapp/\` 前缀。
- 禁止浏览器端直接依赖 Prisma / Kysely 数据库实体类型作为 DTO。
- 禁止在 Route 层编写复杂业务编排、多表事务与直接 SQL 查询。
`,

  'database-design': `---
name: database-design
description: 表结构设计、迁移、多租户隔离、多数据库兼容。改 schema、仓储、SQL 时启用。
---

# 数据库设计与多库兼容规范

## 1. 适用场景
- 设计新业务表、扩展已有字段或设计多对多关联。
- 执行数据库迁移（Prisma Migration）。
- 编写 Kysely 仓储层查询与多数据库方言兼容适配。

## 2. 权威依据
- \`AGENTS.md\` §3.3 (数据库边界与 Kysely 仓储规范)
- \`AGENTS.md\` §4.6 (事务与状态守卫规范)
- \`AGENTS.md\` §6.1 (database-compatibility 治理规范)
- \`docs/architecture/ruoyi-all-next-database-compatibility.md\`
- Prisma Schema（PostgreSQL 为默认主源，兼顾 MySQL / 达梦 / Oracle）

## 3. 标准表结构六大审计字段 (强制包含)
所有业务表必须包含统一命名的多租户与审计字段：

\`\`\`sql
tenant_id    VARCHAR(64) NOT NULL DEFAULT '0', -- 租户ID (多租户隔离)
creator      VARCHAR(64) DEFAULT '',          -- 创建人ID
create_time  TIMESTAMP NOT NULL DEFAULT NOW(),-- 创建时间
updater      VARCHAR(64) DEFAULT '',          -- 更新人ID
update_time  TIMESTAMP NOT NULL DEFAULT NOW(),-- 更新时间
deleted      BOOLEAN NOT NULL DEFAULT FALSE   -- 软删除标记 (0/1 或 false/true)
\`\`\`

## 4. 索引设计铁律
1. **主键**：统一使用有序字符串 ID（如 NanoID / CUID / 雪花ID）或自增 BigInt。
2. **复合索引最左前缀**：涉及多租户查询时，索引必须以 \`tenant_id\` 为前导列：
   \`CREATE INDEX idx_order_tenant_status_time ON mall_orders (tenant_id, status, create_time DESC);\`
3. **软删除查询覆盖**：高频查询必须将 \`deleted\` 纳入组合索引考量。

## 5. 多数据库方言兼容规范
- **禁止使用单库专属方言函数**（如 PG 专有的 \`jsonb_build_object\` 或 MySQL 专有的 \`FIND_IN_SET\`）。
- 仓储层统一使用 **Kysely 查询构建器**，由驱动层抹平参数化占位符差异（PG \`$1,$2\` vs MySQL \`?,?\`）。
- 内存回退机制：当未连接真实物理数据库时，Repository 必须提供完全一致的 MEMORY_STORE 模拟实现，保证离线与轻量单元测试 100% 可行。

## 6. 绝对禁止项
- 严禁通过字符串拼接拼装 SQL（防止 SQL 注入）。
- 严禁跨域直接操作他域的数据表（必须走 Domain Facade）。
- 严禁生产环境无备份直接执行破坏性迁移（DROP COLUMN / DROP TABLE）。
`,

  'architecture-design': `---
name: architecture-design
description: 架构演进、单体与微服务拆分、前后端分离、网关与跨域通信。
---

# 架构设计与微服务演进规范

## 1. 适用场景
- 确定系统部署形态（单体/拆分）、网关路由与服务拓扑。
- 定义领域边界（Bounded Context）与跨域依赖关系。
- 实施阶段演进（阶段 A 单体 -> 阶段 B BFF 代理 -> 阶段 C 独立微服务）。

## 2. 权威依据
- \`AGENTS.md\` §1 (项目定位与复用基座)
- \`AGENTS.md\` §3 (架构总览、目录约束与可替换后端边界)
- \`AGENTS.md\` §6.1 (microservice-evolution 治理)
- \`docs/architecture/ruoyi-all-next-architecture.md\`
- \`docs/architecture/ruoyi-all-next-microservice-governance.md\`
- \`src/modules/shared/backend/constants/domain-catalog.json\`

## 3. 三阶段演化路径 (Evolution Stages)

\`\`\`
[ 阶段 A: 模块化单体 (Modular Monolith) ]  <-- 当前主形态
    Next.js 同进程运行，各 Domain 通过 Domain Facade 内存互调 (零序列化开销)
          ↓ (流量增长 / 团队拆分)
[ 阶段 B: BFF 网关代理 (BFF + Split Upstream) ]
    Next.js 作为智能网关，按 Route Manifest 动态反向代理至独立域进程
          ↓ (独立数据所有权 / 多语言)
[ 阶段 C: 独立微服务 (Autonomous Microservices) ]
    域服务独立部署 (Node/Go)，分库分表，通过自研 NATS/gRPC 与 可靠事件总线交互
\`\`\`

## 4. 跨域调用双模机制 (Dual-Mode Communication)

跨域必须且只能通过 **Domain Facade** 调用，底层由运行时自动切换通信载体：

\`\`\`typescript
// 业务代码中统一写法 (透明双模):
const dictData = await systemPublicFacade.getDictDataByType("sys_user_sex")
\`\`\`

- **单体模式（In-Process）**：Facade 直接调用本进程对应 Service 实例，零网络损耗。
- **微服务模式（Remote RPC）**：Facade 自动切入 \`broker.call('ruoyi.cmd.system.getDictDataByType', payload)\`，通过 HTTP/NATS 发送至远程服务。

## 5. 可靠事件总线 (Outbox + Inbox 模式)
- 跨域异步解耦禁止依赖单机内存 EventEmitter（防止进程重启丢失事件）。
- 生产跨域事件必须写入 **Outbox 事务表**，由发布者可靠发送至消息总线，消费端经 **Inbox 幂等表** 去重后执行。

## 6. 绝对禁止项
- 禁止任何业务域直接 import 另一个业务域的 Service 或 Repository。
- 禁止未经流量和数据边界论证，盲目为了“微服务”而将系统碎片化。
- 禁止使用用户前端 JWT 令牌作为微服务之间的内部调用凭证（必须走 \`RUOYI_RPC_TOKEN\`）。
`,

  'service-governance': `---
name: service-governance
description: 超时重试、熔断降级、隔板舱壁、限流防刷、链路追踪、高可用保障。
---

# 服务治理与高可用保障规范

## 1. 适用场景
- 配置跨域/跨服务调用的容错与稳定性策略。
- 实现防刷限流、降级保护与分布式并发控制。
- 注入链路追踪 TraceId 与敏感操作安全审计。

## 2. 权威依据
- \`AGENTS.md\` §3.3 (服务调用/超时重试/熔断/隔板/可靠事件总线)
- \`AGENTS.md\` §4.5 (日志与审计规范)
- \`src/modules/shared/backend/constants/microservice-governance.json\`
- \`src/modules/shared/backend/lib/broker-resilience.ts\`
- \`src/modules/shared/backend/lib/rate-limiter.ts\`
- \`src/modules/shared/backend/lib/trace-context.ts\`

## 3. 六大核心治理策略

### 1. 超时控制 (Timeout)
- 所有外部/远程调用必须声明显式超时（默认查询 3000ms，复杂计算 8000ms），禁止无限期挂起。

### 2. 幂等与重试 (Retry with Idempotency)
- 只允许对**幂等只读操作**执行自动重试（最多 2~3 次，指数退避算法：100ms, 200ms, 400ms）。
- 涉及写操作必须携带 \`Idempotency-Key\`，由服务端记录防重。

### 3. 熔断器 (Circuit Breaker)
- 当调用下游失败率超过阈值（如 50% 且样本数 >= 10）时，自动触发 **OPEN（开路）**，快速失败阻止雪崩。
- 经过休眠窗口（如 5s）后进入 **HALF-OPEN（半开）** 探测，成功则恢复 **CLOSED（闭路）**。

### 4. 隔板隔离 (Bulkhead)
- 每个下游域配置独立并发槽位（如并发上限 20，队列等待 50），避免单个慢接口耗尽整个服务的线程池。

### 5. 分布式限流 (Rate Limiting)
- 接口级限流：基于令牌桶 / 滑动窗口算法。
- 区分维度：IP 限流（防恶意爬虫）、User 限流（防高频连击）、API 全局限流（防流量洪峰）。
- 超限统一响应 \`HTTP 429 Too Many Requests\` 并返回 \`Retry-After\` 响应头。

### 6. 全链路追踪 (Distributed Tracing)
- 网关生成或继承 \`x-trace-id\`，全程透传至各层日志、RPC Header 与异步事件。
- 结构化日志必须打上 \`traceId\`, \`tenantId\`, \`userId\` 标签。

## 4. 绝对禁止项
- 严禁调用第三方或远程服务时不设超时时间。
- 严禁熔断后无降级策略导致整站瘫痪。
- 严禁将限流作为鉴权的替代品。
`,

  'coding': `---
name: coding
description: Modules-First 分层编码、CRUD 生成规范、事务与状态机落地。
---

# 编码实现与工程分层规范

## 1. 适用场景
- 编写 API Route、业务 Service、Validator、Repository 与前端页面。
- 扩展现有模块能力或接入代码生成器产物。

## 2. 权威依据
- \`AGENTS.md\` §4 (编码规范：Route/Service/Validator/权限/日志)
- \`AGENTS.md\` §5 (Domain-First 研发流程六要素：API / Service / Validator / Page / Permission / Log+Test)
- \`AGENTS.md\` §11 (代码规模与拆分约束：单文件 > 200 行拆子服务)
- \`AGENTS.md\` §14 (代码生成器架构规范与目录分层)
- \`docs/guides/service-design-patterns.md\`

## 3. 标准 Modules-First 目录规范
\`\`\`
src/modules/{domain}/
├── contract/
│   ├── {entity}.actions.ts            ← 契约 Schema (HTTP 与 Broker 共享)
│   └── {domain}.facade.ts            ← 领域门面 (对外暴露的唯一同步入口)
├── backend/
│   ├── types/{entity}.types.ts        ← 领域实体与 DTO 定义
│   ├── validators/{entity}.validator.ts ← Zod 验证器
│   ├── repositories/{entity}.repository.ts ← Kysely + 内存回退仓储
│   ├── services/{entity}.service.ts    ← 核心业务逻辑 (事务、状态机、审计)
│   └── services/__tests__/{entity}.test.ts ← Vitest 自动化测试
└── frontend/
    ├── api/{entity}.api.ts            ← 前端 API 封装
    ├── components/{Entity}Form.tsx    ← 弹窗/表单组件
    └── pages/{entity}-list.page.tsx   ← 列表管理页
\`\`\`

## 4. 标准分层职责清单
- **Route 层（\`src/app/api/v1/**/route.ts\`）**：
  - 纯粹的协议适配层（薄层）：解析 Query/Body -> 鉴权与权限校验 -> 调用对应 Service -> 返回统一封装。
  - **严禁**在此编写业务编排、开启事务或手写 SQL。
- **Service 层（\`modules/<domain>/backend/services\`）**：
  - 业务核心逻辑闭环：参数二次校验、状态守卫检查、开启数据库事务、记录 Event/Audit 结构化日志。
- **Repository 层（\`modules/<domain>/backend/repositories\`）**：
  - 数据持久化：执行参数化 SQL / Kysely 构建，处理租户条件过滤。

## 5. 绝对禁止项
- 严禁使用 \`any\` 糊弄类型边界。
- 严禁在业务代码中使用 \`console.log\`（必须使用统一结构化 logger）。
- 严禁跳过 Validator 将未清洗参数直接传入 Service。
`,

  'automated-testing': `---
name: automated-testing
description: 单元测试、集成测试、契约测试、权限测试与门禁验证。
---

# 自动化测试与质量门禁规范

## 1. 适用场景
- 新增业务域或模块功能后的自动化测试补齐。
- 验证核心路径正确性、权限拒绝分支与事务回滚机制。
- 发布前的质量门禁检查。

## 2. 权威依据
- \`AGENTS.md\` §6 (能力同步与治理门禁)
- \`AGENTS.md\` §8 (测试规范：每个新域至少 1 条关键路径自动化测试)
- 域测试目录：\`src/modules/<domain>/backend/services/__tests__/\`

## 3. 测试覆盖四必测用例

每个业务能力必须提供以下 4 类测试用例：

\`\`\`typescript
describe("EntityService Core Capabilities", () => {
  // 1. 正向业务主流程测试
  it("should successfully create and query entity", async () => {
    const created = await EntityService.create({ name: "测试数据" })
    expect(created.id).toBeDefined()
    const found = await EntityService.getById(created.id)
    expect(found.name).toBe("测试数据")
  })

  // 2. 权限拒绝边界测试
  it("should reject unauthorized operations with 403 / ForbiddenError", async () => {
    await expect(
      EntityService.sensitiveAction({ role: "GUEST" })
    ).rejects.toThrow(/Forbidden|无权/)
  })

  // 3. 参数校验与异常拦截测试
  it("should reject invalid inputs with Zod validation error", async () => {
    await expect(
      EntityService.create({ name: "" }) // 空名称
    ).rejects.toThrow()
  })

  // 4. 事务失败回滚测试
  it("should rollback database changes when transactional step fails", async () => {
    await expect(
      EntityService.createWithFailingStep({ name: "回滚测试" })
    ).rejects.toThrow()
    const list = await EntityService.list({ keyword: "回滚测试" })
    expect(list.total).toBe(0) // 验证无脏数据残留
  })
})
\`\`\`

## 4. 常用测试与门禁命令
\`\`\`bash
# 运行指定测试文件
npx vitest run src/modules/<domain>/backend/services/__tests__/

# 运行全量单元测试
npm test

# 运行全链路治理门禁检查
npm run check
\`\`\`

## 5. 绝对禁止项
- 严禁使用“手工在界面点一下”代替自动化测试代码。
- 严禁将未通过测试或缺失测试的模块在矩阵中标记为 \`DONE\`。
- 严禁测试用例包含真实生产密钥或个人隐私数据。
`,

  'security': `---
name: security
description: 身份鉴权、SQL 防注入、敏感脱敏、防重放、接口限流与安全风控。
---

# 安全防护与风控合规规范

## 1. 适用场景
- 编写公开接口、敏感资金/权限操作、第三方回调。
- 实施数据加解密、防 SQL 注入、多租户防越权与敏感字段脱敏。

## 2. 权威依据
- \`AGENTS.md\` §3.3 (受信任服务身份与跨域凭证传递)
- \`AGENTS.md\` §4.4 (权限码规范，禁止硬编码角色)
- \`AGENTS.md\` §4.5 (日志脱敏与审计要求)
- \`AGENTS.md\` §12 (常见安全禁止项)
- \`docs/specs/api-security-persistence-spec.md\`
- \`src/modules/shared/backend/auth/\`

## 3. 核心安全防御矩阵

### 1. 身份与令牌鉴权 (Authentication)
- Admin 端与 Member 端 Token 体系完全隔离，签名密钥与有效载荷独立。
- 禁止信任调用方伪造的 \`x-user-id\` 或 \`x-tenant-id\` Header（必须从验证通过的 JWT 中解析）。

### 2. 开放接口防重放 (HMAC + Nonce + Timestamp)
- 开放接口 (\`/api/v1/open\`) 必须包含：
  - \`X-Timestamp\`：请求时间戳（服务器时钟漂移容忍 <= 300 秒）。
  - \`X-Nonce\`：一次性随机串（Redis 记录 5 分钟排重）。
  - \`X-Signature\`：基于 Secret 计算的 HMAC-SHA256 签名。

### 3. SQL 注入防御 (SQL Injection Prevention)
- 所有查询必须走 Prisma / Kysely 参数化查询。
- 动态排序（OrderBy）字段必须通过严格的白名单枚举校验：
  \`\`\`typescript
  const ALLOWED_SORT_FIELDS = ["create_time", "price", "sales"] as const
  const sortField = ALLOWED_SORT_FIELDS.includes(input.sortBy) ? input.sortBy : "create_time"
  \`\`\`

### 4. 敏感数据脱敏与保护 (Data Masking)
- 手机号（前 3 后 4 脱敏：\`138****1234\`）、身份证号、银行卡号在日志与列表响应中脱敏展示。
- 密码必须使用强散列（Bcrypt / Argon2）加盐存储，严禁明文存储。

### 5. 审计日志 (Audit Logging)
- 密码修改、权限变更、租户配置、资金结算等敏感操作必须记录独立 Audit 审计日志，包含操作人、IP、时间、变更前后 Diff。

## 4. 绝对禁止项
- 严禁为了“本地调通”而临时注释鉴权中间件并提交到仓库。
- 严禁将密码、API Key、Token 或未脱敏数据打印到日志中。
- 严禁将扫描发现的安全漏洞（CVE）直接标记为修复而不升级安全依赖。
`,

  'devops': `---
name: devops
description: 容器化编排、Traefik 网关、SSL 证书自动签发轮换、平滑发布与回滚。
---

# DevOps 运维部署与发布规范

## 1. 适用场景
- 本地开发、测试、预发与生产环境部署。
- 配置域名映射、反向代理、自动化 SSL 证书申请与平滑更新。

## 2. 权威依据
- \`AGENTS.md\` §9 (本地开发与运行步骤)
- \`AGENTS.md\` §10 (构建部署与发布门禁)
- \`deploy/README.md\`
- \`deploy/docker-compose.prod.yml\` (Traefik + PostgreSQL + Redis + App)

## 3. 多环境编排矩阵

| 环境 | 编排文件 | 数据库形态 | 网关与端口 | 适用场景 |
|---|---|---|---|---|
| **Local** | \`deploy/docker-compose.local.yml\` | 内存 / SQLite | 直连 3100 | 单机极速体验 |
| **Dev** | \`deploy/docker-compose.dev.yml\` | 独立 PostgreSQL 容器 | 直连 3100 | 本地功能开发 |
| **Prod** | \`deploy/docker-compose.prod.yml\` | 生产 PostgreSQL + Redis | Traefik (80/443) | 预发与正式生产 |
| **Split** | \`deploy/docker-compose.domains.yml\` | BFF + 独立域服务 | Traefik 路由 | 拆分部署验证 |

## 4. 域名映射与 Traefik SSL 证书自动续期

生产环境使用 Traefik 作为反向代理入口，自动通过 Let's Encrypt 申请并续期 SSL 证书：

\`\`\`yaml
services:
  traefik:
    image: traefik:v3.1
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=admin@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
\`\`\`

## 5. 平滑发布与零停机更新 (Zero-Downtime Rolling Update)
1. **健康检查探针**：容器必须配置 \`HEALTHCHECK\` 探针调用 \`/api/v1/open/health\`。
2. **滚动替换**：新版本容器就绪（Healthy）后，Traefik 自动切换流量至新容器，并优雅终止旧容器。
3. **版本回滚 SOP**：若新版本异常，直接拉起前一个带版本 Tag 的镜像标签（如 \`v1.0.2\`），严禁依赖覆盖 \`latest\` 标签。

## 6. 绝对禁止项
- 严禁通过 SSH 手工进入生产容器修改源代码。
- 严禁将调试端口（5432, 6379, 9229）直接暴露至公网。
- 严禁在未做数据库备份的情况下执行任何 DDL 迁移。
`
};

for (const [skillName, content] of Object.entries(skillsData)) {
  // Update docs/skills/ruoyi-all-next/<skillName>.SKILL.md
  const docsPath = path.join(srcDir, skillName + '.SKILL.md');
  fs.writeFileSync(docsPath, content, 'utf8');

  // Update .agents/skills/<skillName>/SKILL.md
  const agentSubDir = path.join(dstDir, skillName);
  if (!fs.existsSync(agentSubDir)) fs.mkdirSync(agentSubDir, { recursive: true });
  const agentPath = path.join(agentSubDir, 'SKILL.md');
  fs.writeFileSync(agentPath, content, 'utf8');

  console.log('Successfully deepened and detailed skill:', skillName);
}

console.log('All skills have been upgraded with comprehensive, production-grade instructions.');

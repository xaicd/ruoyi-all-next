# ruoyi-all-next 架构总览

更新时间：2026-08-25

## 1. 项目定位

基于 Next.js 15 的全栈企业级应用平台，从 RuoYi-Vue-Pro (Spring Boot) + yudao-ui-admin-vue3 全量迁移而来。采用模块化单体架构，具备向微服务平滑演进的能力。

## 2. 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 框架 | Next.js 15 (App Router) | 全栈 React 框架 |
| 语言 | TypeScript 5 | 全栈类型安全 |
| 数据库 | PostgreSQL + Prisma | ORM + 多数据库兼容 |
| 校验 | Zod | 运行时类型校验 |
| UI | React 19 + Tailwind CSS | 组件化 + 原子 CSS |
| 测试 | Vitest | 单元/集成测试 |
| 部署 | Docker + K8s | 容器化部署 |

## 3. 目录结构

```
ruoyi-all-next/
├── .kiro/
│   └── steering/                    # Agent 规范与 Skill
│       ├── ui-development-standards.md
│       └── ui-ux-pro-max/           # UI/UX 设计系统
│
├── docs/
│   ├── architecture/                # 架构文档
│   │   ├── artifacts/               # 扫描产物（JSON）
│   │   ├── ruoyi-all-next-architecture.md  ← 本文件
│   │   ├── ruoyi-all-next-capability-matrix.md
│   │   ├── ruoyi-all-next-domain-governance.md
│   │   ├── ruoyi-all-next-harness-evolution.md  # DeepSeek Harness 思想 × NPC 模板
│   │   ├── ruoyi-all-next-sync-taskboard.md
│   │   └── ruoyi-full-migration-board.md
│   ├── guides/                      # 开发指南
│   │   └── service-design-patterns.md
│   └── skills/                      # 治理 Skill
│
├── scripts/                         # 开发脚本（不参与构建）
│   ├── codegen-from-source.ts       # 源仓库能力扫描器（不生成代码）
│   ├── scaffold-feature.ts          # 功能脚手架
│   └── fix-*.cjs                    # 修复工具脚本
│
├── src/
│   ├── app/                         # Next.js 路由层（薄壳）
│   │   ├── api/v1/admin/            # 管理后台 API（计划迁移）
│   │   ├── api/v1/app/              # 用户端 API（计划新增）
│   │   ├── api/v1/open/             # 开放接口（计划新增）
│   │   ├── (admin-pages)/admin/     # 管理后台页面入口
│   │   ├── (app-pages)/             # 用户端页面入口（计划新增）
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   └── modules/                     # 全部业务实现
│       ├── shared/                  # 核心基础模块（永远 SDK，不可独立部署）
│       │   ├── backend/
│       │   │   ├── constants/       # 权限码、菜单、域目录、RPC 策略
│       │   │   │   ├── permissions.ts
│       │   │   │   ├── admin-menu.ts
│       │   │   │   └── domain-catalog.json
│       │   │   ├── lib/             # 基础设施层（微服务治理）
│       │   │   │   ├── auth-gateway.ts        # 统一授权网关
│       │   │   │   ├── service-bus.ts         # 跨域调用总线
│       │   │   │   ├── event-bus.ts           # 异步事件总线
│       │   │   │   ├── trace-context.ts       # 链路追踪
│       │   │   │   ├── config-center.ts       # 配置中心
│       │   │   │   ├── rate-limiter.ts        # 限流风控
│       │   │   │   ├── crypto-engine.ts       # 加密引擎
│       │   │   │   ├── exception-analyzer.ts  # 异常分析
│       │   │   │   ├── api-registry.ts        # 接口注册治理
│       │   │   │   ├── domain-log.ts          # 业务事件日志
│       │   │   │   ├── audit-log.ts           # 审计日志
│       │   │   │   ├── permission-guard.ts    # 权限校验
│       │   │   │   ├── cache-store.ts         # 缓存抽象
│       │   │   │   ├── platform-mq.ts         # 消息队列抽象
│       │   │   │   └── persistence-datasource.ts # 多数据源
│       │   │   └── prisma.ts        # Prisma 客户端
│       │   └── frontend/
│       │       ├── templates/       # 页面模板
│       │       │   └── admin-list-page.template.tsx
│       │       └── components/      # 公共 UI 组件
│       │           └── ui/          # 基础组件（Button/Card/Input...）
│       │
│       ├── system/                  # 系统管理域（32 子模块）
│       │   ├── backend/
│       │   │   ├── services/        # Service 实现
│       │   │   └── validators/      # Zod Schema
│       │   └── frontend/
│       │       ├── pages/           # 页面组件
│       │       └── components/      # 域专属组件
│       │
│       ├── infra/                   # 基础设施域（15 子模块）
│       ├── bpm/                     # 流程中心（12 子模块）
│       ├── pay/                     # 支付中心（11 子模块）
│       ├── mall/                    # 商城域（40 子模块）
│       ├── crm/                     # 客户中心（24 子模块）
│       ├── erp/                     # 经营中台（23 子模块）
│       ├── mes/                     # 制造执行（127 子模块）
│       ├── wms/                     # 仓储中心（17 子模块）
│       ├── ai/                      # AI 中台（14 子模块）
│       ├── iot/                     # IoT 中台（18 子模块）
│       ├── im/                      # 即时通讯（30 子模块）
│       ├── mp/                      # 公众号中心（12 子模块）
│       ├── member/                  # 会员中心（11 子模块）
│       └── report/                  # 报表中心（2 子模块）
│
├── package.json
├── tsconfig.json
├── next.config.mjs
└── AGENTS.md                        # 开发工作手册
```

## 4. 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser / App)                │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│              Next.js Route Layer (src/app/)              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ API Route│  │ API Route│  │   Page   │              │
│  │ (admin)  │  │  (app)   │  │  Entry   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
└───────┼──────────────┼─────────────┼────────────────────┘
        │              │             │
┌───────▼──────────────▼─────────────▼────────────────────┐
│           Shared Infrastructure (modules/shared)         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   Auth   │ │   Rate   │ │  Trace   │ │  Config  │   │
│  │ Gateway  │ │ Limiter  │ │ Context  │ │  Center  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Service  │ │  Event   │ │Exception │ │   API    │   │
│  │   Bus    │ │   Bus    │ │ Analyzer │ │ Registry │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│              Domain Modules (modules/<domain>)           │
│                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ system  │ │   pay   │ │  mall   │ │   im    │ ... │
│  │ Service │ │ Service │ │ Service │ │ Service │      │
│  │Validator│ │Validator│ │Validator│ │Validator│      │
│  │  Page   │ │  Page   │ │  Page   │ │  Page   │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│              Data Layer (Prisma + PostgreSQL)            │
└─────────────────────────────────────────────────────────┘
```

## 5. 微服务演进路径

### 阶段 A：模块化单体（代码仍按此组织）

- 所有域共享一个 Next.js 代码库
- 域代码落在 `src/modules/<domain>`
- 未配置 upstream 时，BFF 同进程处理全部 API

### 阶段 B：可拆分单体（打包/运行/部署已接通）

- 每个域有 `contract/route.manifest.yaml` 与 catalog 声明
- NPC 发现面：`agent-profile.json` + 由 catalog 生成的 `seam-graph.json`（禁止手写第二份域名）
- 可用 `npm run domain:pack|dev|build` 产出 API-only 进程
- BFF 通过 `RUOYI_DOMAIN_<DOMAIN>_UPSTREAM` 把该域 API 切到独立进程
- 数据库仍默认共享，独立 schema/独库尚未作为默认

### 阶段 C：微服务化（未完成）

- 每个域独立部署为 Next.js 或 Go 服务
- service-bus 在同进程走 SDK，跨进程走 RPC（默认 nats-rr + JSON；跨语言 typed 调用预留 gRPC + protobuf）
- event-bus 切换为 Kafka/Redis Streams + transactional outbox
- 独立数据库（per service）
- 网关统一入口（Traefik）
- 服务注册与发现（K8s DNS）

独立打包细节见 `docs/architecture/ruoyi-all-next-domain-pack.md`。SDK/RPC 双模见 `docs/architecture/ruoyi-all-next-module-rpc.md`。

## 6. 域间通信规范

```typescript
// ❌ 禁止：跨域直接 import
import { PayService } from "@/modules/pay/backend/services"

// ✅ 正确：走 Domain Facade（同进程 SDK，跨进程 RPC）
import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"
const pay = createDomainFacade("pay", ["createOrder"] as const)
await pay.createOrder({ amount: 9900 }, { caller: "mall.order" })

// ✅ 正确：走 event-bus
import { eventBus } from "@/modules/shared/backend/lib/event-bus"
await eventBus.publish({
  type: "mall.order.created", source: "mall", payload: {...}
})
```

## 7. 多端能力

权威标准：`docs/architecture/ruoyi-all-next-client-channels.md`（契约 `src/modules/shared/contract/client-channels.json`）。

| API 面 | URL 前缀 | 鉴权 | 使用渠道 |
|---|---|---|---|
| admin | `/api/v1/admin/*` | 管理员 JWT + 权限码 | 管理端 PC、跨平台 PC 客户端 |
| app | `/api/v1/app/*` | 会员 JWT | H5、uni-app、Flutter |
| open | `/api/v1/open/*` | 公开或签名 | 品牌/错误码/OpenAPI、支付回调 |
| internal | `/api/internal/*` | 服务间 token | 仅服务间，客户端禁用 |

渠道：`admin-web`（已交付）、`h5` / `uniapp` / `flutter` / `desktop-pc`（标准已发布，工程未交付）。请求头 `X-Client-Channel` 必须是渠道 id。品牌只来自 `project-profile`。

## 8. 数据规模

| 指标 | 数量 |
|---|---|
| 业务域 | 15 |
| 后端子模块（Service） | 388 |
| API 端点 | 2095 |
| 前端页面模块 | 130 |
| 前端组件文件 | 1315 |
| 基础设施组件 | 15 |

## 9. 关键约束

1. `src/app/` 只放路由壳（1-15 行），真实实现在 `modules/`
2. 域间通信必须走 Domain Facade（同进程 SDK / 跨进程 RPC）或 event-bus
3. 每个域独立 validators + services + pages
4. `shared` 是核心基础 SDK；`system`/`infra` 是平台域；其余是业务域。禁止把 shared 拆成微服务
5. API 必须版本化
6. 敏感操作必须有审计日志
7. 所有写接口必须有 Zod 校验


## 10. 多级模块嵌套规范（对标 Spring Cloud 多 Module）

### 10.1 拆分规则

| 条件 | 结构 |
|---|---|
| 域 ≤ 5 个 service | 平铺在 `backend/services/` |
| 域 6-15 个 service | 可选拆分 |
| 域 > 15 个 service | **必须**按子域拆分 |

### 10.2 子域 Package 结构

```
modules/<domain>/
├── <sub-domain>/               ← 子域（= Java 子 module）
│   ├── services/               ← 业务实现
│   ├── validators/             ← Zod Schema
│   ├── repositories/           ← 数据访问层（对接 Prisma）
│   ├── types/                  ← 领域类型（DO/VO）
│   ├── enums/                  ← 枚举定义
│   └── api.ts                  ← 对外契约（其他子域只能通过这里访问）
├── frontend/
│   ├── <sub-domain>/pages/     ← 按子域分组的前端页面
│   └── components/             ← 域共享组件
└── index.ts                    ← 域门面导出
```

### 10.3 子域间访问规范

```typescript
// ✅ 正确：通过 api.ts 契约访问
import { ProductQueryService } from "../product/api"

// ❌ 禁止：穿透访问子域内部实现
import { SpuService } from "../../product/services/spu.service"
```

### 10.4 大域拆分计划

| 域 | 子域拆分 | 状态 |
|---|---|---|
| mall (40) | product / trade / promotion / statistics | 计划 |
| mes (127) | cal / md / pro / qc / tm / wm | 计划 |
| system (32) | auth / user / permission / tenant / notify / log | 计划 |
| crm (24) | customer / business / contract / statistics | 计划 |
| erp (23) | product / purchase / sale / stock / finance | 计划 |
| im (30) | friend / group / message / manager | 计划 |
| iot (18) | device / product / alert / rule / ota | 计划 |
| infra (15) | codegen / job / file / monitor / config | 进行中 |

### 10.5 微服务拆分时的操作

1. 子域目录整体搬到独立仓库
2. `api.ts` 的直接 import 改为 `serviceBus.call()`
3. 独立 `package.json` + `next.config.mjs`
4. 独立数据库 schema
5. 通过网关统一入口

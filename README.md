# ruoyi-all-next

> 🤖 **AI-Agent-First 架构宣言与机器契约 (For Autonomous AI Agents & DigitalStaff NPCs)**:  
> 本仓库是专为 AI Coding Agent（Cursor、Windsurf、Claude Code、Devin、Coolie、DigitalStaff NPC 等）构建的 **AI 原生商业软件工程工作区底座 (Workspace Bundle)**。  
> **核心铁律 0 (Zero Token Waste)**：业务开发与功能拓展强制采用 **Schema / DSL 极简声明式驱动**（上下文压缩至 <500 Tokens），由底层通用引擎自动展开，严禁人肉逐行生成千篇一律的重复 CRUD、样板代码与伪造 Mock！

---

## ⚡ 1. 外部 AI 零下载感知与 10 秒骨架派生 (Zero-Git-History Hatching)

外部 AI Agent 或开发者在接入或使用本底座时，**无需下载 500MB+ 全量历史提交包**，可在 10 秒内直接派生一个干净、合规、零外部依赖的全新客户业务工程：

```bash
# 方案 A: 官方专属 CLI 极速派生 (推荐，自动完成初始化与本地库创建)
npx create-ruoyi-app my-app

# 方案 B: degit 骨架拉取 (10秒内完成，0MB 历史提交)
npx degit xaicd/ruoyi-all-next#main my-app
cd my-app && pnpm install
npm run project:init -- --name "my-app" --title "我的新业务系统"
npm run dev
```

> **自动化完成的核心事项**：
> - ⚡ **秒级骨架派生**：彻底规避几百兆历史提交与 packfile 下载；
> - 🏷️ **业务身份重构**：`project:init` 自动重构包名、中文标题、版权与环境配置；
> - 🗄️ **真实本地数据库自动就绪**：基于真实 SQLite 数据库驱动（`data/ruoyi.db`），零外部容器即可立即运行全部业务；
> - 🌐 **原生四国语言 (i18n)**：开箱即用支持 🇨🇳 中文 (`zh-CN`)、🇺🇸 英文 (`en-US`)、🇯🇵 日文 (`ja-JP`)、🇰🇷 韩文 (`ko-KR`)；
> - 🔐 **废除弱口令与 admin 凭据**：平台唯一引导管理员升级为 `supervip`，随机生成 16 位高熵加密密码并自动持久化写入 `.env.local`，杜绝任何弱口令泄露；
> - 🛡️ **SpaceX 级全链路门禁**：执行 `npm run check` 自动核验 10 大工程标准，立享 100% 绿灯质量护栏。

### 🔌 一键接入主流 AI Agent (MCP Server)

Cursor、Windsurf、Claude Code、Cline 或任何 MCP 兼容客户端，可在其配置中直接引入本底座的 MCP 服务，赋能 AI 智能体秒级掌握本体图谱与工程门禁：

```json
{
  "mcpServers": {
    "ruoyi-all-next": {
      "command": "npx",
      "args": ["-y", "@ruoyi/mcp-server"]
    }
  }
}
```
*(在本地工作区内开发时，亦可直接执行 `node scripts/mcp/ruoyi-mcp-server.cjs` 启动 stdio 通道)*

---

## 🗺️ 2. 机器可读契约与全息本体导航 (RFC 8615 & Ontology Seams)

外部 AI Agent 可在**下载前**通过 GitHub Raw 或 live HTTP 接口直接检索机器契约，秒级获取架构图谱与工具特征：

| 契约端点 (Machine-Readable Endpoints) | 规范标准 | 核心价值 / Agent 消费场景 |
|---|---|---|
| [`llms.txt`](llms.txt) | LLMs.txt RFC | 专为大模型量身定制的高密度架构全景与执行导航（<15KB） |
| [`compat-manifest.json`](compat-manifest.json) | 机器特征契约 | 17 域能力画像、全量 API 路由与 RPC action 元数据（用于自动生成与验证） |
| [`agent-profile.json`](agent-profile.json) | DigitalStaff 规范 | AI 智能体画像、12 大内置 MCP 工具定义、权限码规范与白名单 |
| [`.well-known/agent.json`](.well-known/agent.json) | RFC 8615 行业标准 | 开放标准化 Agent 发现协议，第三方智能体（如 Coolie）可自动化握手 |

> **实时 HTTP 探针**：服务启动后支持根路径直接探活：  
> `GET http://localhost:3200/llms.txt`  
> `GET http://localhost:3200/compat-manifest.json`  
> `GET http://localhost:3200/.well-known/agent.json`

---

## 🏛️ 3. 架构拓扑与三层物理边界 (Architectural Seams)

AI 施工时必须遵守严格的模块分层与物理边界，**严禁凭感觉放置文件**：

```
ruoyi-all-next/
├── packages/
│   ├── shared/                       # 核心基础 SDK (永远是 SDK，严禁当作微服务)
│   │   ├── backend/constants/        # 权限码、菜单、domain-catalog.json 权威真源
│   │   ├── backend/lib/              # 鉴权网关、biz-tenant 上下文、服务总线、审计日志
│   │   └── contract/                 # 跨域共享契约、OpenAPI、DTO
│   │
│   ├── domains/                      # 平台基础地基 (不可插件化、永远伴生)
│   │   ├── system/                   # RBAC、用户、角色、租户、权限、数据字典
│   │   └── infra/                    # 配置、定时调度、文件存储、低代码生成引擎
│   │
│   └── plugins/                      # 15 个第一方可插拔业务域 (独立生命周期、可独立打包)
│       ├── plugin-bpm/               # 工作流中心
│       ├── plugin-pay/               # 支付与退款网关
│       ├── plugin-mall/              # 数字化商城
│       ├── plugin-crm/               # 客户关系中台
│       ├── plugin-erp/               # 进销存与经营中台
│       ├── plugin-wms/               # 智能仓储
│       ├── plugin-mes/               # 制造执行系统
│       ├── plugin-ai/                # 大模型中台与网关
│       └── ...                       # report, mp, member, iot, im 等
│
├── src/app/                          # BFF 薄接入层 (API Routes / Proxy / Admin 运营后台页面)
└── clients/expo/                     # 跨端移动与 C 端应用壳
```

### 🚨 跨域调用三原则（门禁强校验）：
1. **严禁跨域直接 import**：禁止在业务域内直接 import 其它域的 Service、Repository 或 Prisma Model；
2. **强制 Domain Facade / Broker**：跨域同步调用必须走 `createDomainFacade("<domain>")` 或 `broker.call("ruoyi.cmd.<domain>.<method>")`；
3. **双模无缝切换**：单体运行时走内存 SDK 直接调用，微服务独立部署时自动切换为 RPC，对外契约完全等价。

---

## 🛠️ 4. AI-Driven 研发交付链与 12 大内置指令

AI Agent 在本工程施工时，严禁使用“就事论事打补丁”的外包初级视角，必须按标准研发流水线推进：

```
       【一句话业务诉求】
              │
              ▼
   Step 1. 立特性 (npm run feature:new -- --name <名> --domain <域>)
              │   └─ 编辑 docs/features/<名>/brief.json (仅约 500 Token)
              ▼
   Step 2. 自动展开 (npm run feature:build -- --name <名>)
              │   └─ 自动生成 6 份工程文档、evidence.json 与 runbook.json
              ▼
   Step 3. 域与代码生成 (npm run domain:new <域>)
              │   └─ 基于 Schema 自动展开 CRUD、Service、Validator 与单测
              ▼
   Step 4. 门禁验证 (npm run check && npm run test:unit)
              │   └─ 10 大工程标准全绿退出码保障
              ▼
   Step 5. 任务痕迹验证 (npm run task:verify -- --feature <名> --summary)
              │   └─ 从 Git 提交推导任务完备度 (1 Task = 1 Commit)
              ▼
   Step 6. 平台级真实穿透 (npm run smoke:login && npm run security:scan)
              │   └─ 真实数据库登录 200 + 12 项安全穿透扫描
              ▼
   Step 7. 生产部署与实施 (npm run runbook -- --feature <名> --run)
                  └─ 自动化生产割接与失败秒级回滚
```

### 常用核心命令速查表：

| 任务类型 | 执行命令 | 产物 / 质量门禁说明 |
|---|---|---|
| **工程初始化** | `npm run project:init` | 交互式/参数化重构品牌、初始化真实本地 SQLite 数据库 |
| **契约同步** | `npm run contracts:sync` | 自动同步 `compat-manifest.json`、`agent-profile.json` 等端点 |
| **全量门禁** | `npm run check` | 严格检验 10 大工程标准（包含跨域隔离、路由规范、微服务边界） |
| **单测套件** | `npm run test:unit` | 运行真实数据库驱动的所有单元测试（无假 Mock） |
| **平台登录冒烟** | `npm run smoke:login` | 全流程真实数据库建库、迁移、种子、启动并校验超级管理员登录 |
| **安全渗透扫描** | `npm run security:scan` | 12 项漏洞测试（包含未认证、越权、伪造 Token/Tenant 等） |
| **性能回归护栏** | `npm run load:test` | 对 standalone 生产产物进行压力测试，防吞吐劣化 |
| **新业务域脚手架** | `npm run domain:new <domain>` | 一键新建符合第一方插件规范的业务域代码骨架 |
| **特性生命周期** | `npm run feature:new` / `build` | 声明式特性 Brief 驱动文档与实施方案自动展开 |

---

## 🛡️ 5. 运行时地基与安全铁律 (Security & Invariants)

1. **废除硬编码账号与密码**：
   - 彻底废除 `admin / admin123`；平台超级管理员固定为 `supervip`；
   - 密码由系统启动时通过密码学安全随机函数生成 16 位高熵密码，并持久化在本地 `.env.local` 中（控制台自动打印引导信息）。
2. **多租户隔离唯一权威**：
   - 租户上下文必须且只能来自 `getCurrentTenantId()`（来自 `withAdminRoute` 的全局上下文注入）；
   - 严禁信任或依赖客户端透传的 `tenantId` 参数。
3. **真实数据库驱动 (SpaceX-Grade Testing)**：
   - 默认支持 **Tier-A 零配置 SQLite 本地数据库**（`data/ruoyi.db`），同时原生支持 PostgreSQL 与 MySQL 生产部署；
   - 所有测试与业务流转必须经过真实数据库状态机持久化，严禁前端伪造假 Mock。
4. **日志与审计规范**：
   - 严禁在生产路径中使用 `console.log`；
   - 必须使用 `domainLog` 记录关键业务事件，涉及状态流转、资金、权限等敏感操作强制调用 `auditLog`。

---

## 🚦 6. 交付哲学：No Artifact, No Done

在大型复杂系统的 AI 施工中，**严禁口头声明完工**。每一次工单交付，必须在以下 5 种物理交付物中至少产出一种，并提供退出码为 0 的可核验凭据：

1. **源码提交资产**：符合白名单、无破坏性变更且 `pnpm build` 0 报错的代码 Commit；
2. **契约定义资产**：经过校验且向后兼容的 OpenAPI 契约、Zod Validator 或 Proto；
3. **状态机单测报告**：覆盖正常流转、异常回滚与幂等重试的真实数据库测试套件；
4. **实施与回滚 Runbook**：经过沙箱演练的自动化割接方案与回滚脚本；
5. **安全与渗透报告**：通过全部 12 项安全穿透测试的扫描结果。

---

## 📚 延伸架构文档导航

- [AI 全链路交付工厂与工单规范](docs/architecture/ai-agent-driven-delivery-workflow.md)
- [架构总览与分层设计](docs/architecture/ruoyi-all-next-architecture.md)
- [高阶反向思维与 Harness 约束](.agents/rules/HIGH-ORDER-INVERSE-THINKING.md)
- [开发工作手册 (Universal Directives)](AGENTS.md)
- [多数据库兼容与方言隔离](docs/architecture/ruoyi-all-next-database-compatibility.md)
- [多端渠道能力标准](docs/architecture/ruoyi-all-next-client-channels.md)
- [i18n 国际化多语言使用指南](docs/guides/i18n-guide.md)
- [GEO 生成式引擎与 Agent 原生指南](docs/architecture/GEO-AGENT-NATIVE-ONBOARDING-GUIDE.md)
- [业务项目身份初始化指南](docs/guides/project-profile-bootstrap.md)

---

## 许可证

本项目基于 [MIT License](LICENSE) 开源，Copyright (c) 2026 xaicd。  
本项目自 RuoYi-Vue-Pro 全量迁移而来，上游项目同为 MIT 协议。

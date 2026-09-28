# Module 架构 → Plugin 架构 迁移设计

> 参考实现：Paperclip（`paperclipai/paperclip`，本地 fork 见 `workspace/xaicd/coolie`）
> 状态：**设计草案**。本文只做架构分析与路线，不含实现承诺。

## 1. 两种架构的本质差异

| 维度 | 本仓现状（module） | Paperclip（plugin） |
|---|---|---|
| 组合方式 | **静态**：域代码编译进同一个 Next 应用；路由与门面都是源码 import | **动态**：manifest 声明 + 外部包 + 运行时加载（`packagePath`） |
| 契约真源 | Domain Facade + `.proto` + `actions.ts` | `PaperclipPluginManifestV1`（一份 JSON 声明） |
| 隔离级别 | 逻辑隔离（Facade / broker），**单进程** | 进程隔离（`entrypoints.worker`） |
| 数据 | 单库单 schema，`prisma/migrations` 全量 | 插件**自有 namespace + 自有 migrations**，host 代跑并记录 |
| UI | App Router 文件路径（`src/app/(admin-pages)/admin/<domain>/…`） | `ui.slots[]` 声明 + `exportName`，host 从插件 UI bundle 解析组件挂载 |
| 权限 | permission code（`constants/permissions.ts`） | **capability** 声明，运行时强制 |
| 状态存储 | 各域自有业务表 | `plugin_state` 五段复合键 scoped KV（pluginId/scopeKind/scopeId/namespace/stateKey） |
| 生命周期 | 编译期，装什么编译什么 | install / upgrade / enable / disable + `installOrder` |

## 2. 本仓已有的「准插件」资产（迁移的最大有利条件）

这些不是要新建的，而是**已经具备、只需改接法**：

| 已有资产 | 在插件架构中的对应物 |
|---|---|
| Domain Facade（`<domain>.facade.ts`） | 插件对外 API 边界——**已经是边界了** |
| route manifest + `.proto` + `actions.ts` | manifest 的 `apiRoutes` / `tools` 声明 |
| `domain-catalog.json` | plugin registry（域的权威清单） |
| seam-graph / capability seam | capability 声明与依赖图 |
| broker / serviceBus（`ruoyi.cmd.<domain>.<method>`） | 与外部 worker 通信——**subject 寻址已同构** |
| 本体域导航 + `foundation:ontology:check` | Paperclip 亦以 `packages/ontology-core` 承载本体（概念同源） |

**结论**：本仓缺的不是「域边界」，而是**运行时装载层**。

## 3. 五个硬缺口（真插件化必须解决）

1. **动态 API 装载**
   App Router 是文件系统静态路由，插件无法在运行时注册路由。
   → 需要统一 catch-all 网关（如 `src/app/api/plugins/[...path]/route.ts`）按 manifest 分发到插件 worker。
   Paperclip 的做法：`/api/plugins/:pluginId/api/*` + `auth` / `checkoutPolicy` / `companyResolution` 声明。

2. **UI 动态挂载**
   页面不能运行时注册。
   → 需要 **slot 宿主** + 插件 UI bundle 的解析挂载。
   Paperclip 的做法：`ui/src/plugins/slots.tsx` 提供 `registerPluginReactComponent` / `registerPluginWebComponent` / `resolveRegisteredPluginComponent`，按 `exportName` 解析；并有 UI 源码抽取机制。

3. **数据隔离**
   从「单 schema 全量迁移」到「插件 namespace + 自有迁移」。
   → host 需派生 namespace、代跑迁移、记录 `plugin_migration`（checksum + status）。
   Paperclip 的做法：`database.namespaceSlug` + `migrationsDir` + `coreReadTables` 白名单。

4. **权限 → capability**
   → 把 `permissions.ts` 的 code 体系与 manifest `capabilities` 建立映射，并在调用点做**交集强制**（声明是请求，不是授权）。

5. **构建产物形态**
   `domain:pack` 现在产出「可独立构建的域包」；插件需要的是「运行时产物 + manifest」。
   → 复用现有打包链，补一个 manifest 输出即可（见 P0）。

## 4. 分阶段路线（不破坏现有域，双轨并行）

| 阶段 | 内容 | 风险 |
|---|---|---|
| **P0 ✅** | **manifest 生成器**：把 `domain-catalog` + route manifest + Facade/proto/actions/permissions 归拢为每个域一份 `plugin.manifest.json`。**不改任何运行方式** | 零（只增产物） |
| **P1 ◐** | **API 网关**已完成；**slot 宿主暂缓**（理由见下）。新域以插件方式接入，老域继续走静态路由 | 低（双轨互不影响） |
| **P2** | 插件化域引入 **namespace 迁移**与 **capability 强制** | 中（数据面） |
| **P3** | 域逐个迁到 **worker 入口**（进程隔离）；broker 从进程内切到跨进程（本仓已有 RPC 通道，接口不变） | 高（需按 §6.1 独立测试 + 灰度回滚） |

### P0 实现说明（已完成）

产物：`src/modules/<domain>/contract/plugin.manifest.json`（16 份；`online` 为 handwritten 跳过）。
生成入口与 route manifest 共用同一条管线：`npm run domain:manifests`
（`scripts/lib/domain-catalog.cjs` 的 `writeGeneratedPluginManifests`）。

**设计要点：不引入第二份真源。** 每个字段都从仓库既有文件解析而来：

| manifest 字段 | 真源 |
|---|---|
| `kind/stage/owner/auth/messaging/invoke/pack/dependsOn/upstream` | `domain-catalog.json` |
| `displayName` | `admin-menu.ts` 顶层 `key`+`label` |
| `facadeMethods` | `<domain>*.facade.ts` 的 `*_FACADE_METHODS` |
| `rpc` | `<domain>.proto` 的 `service`/`rpc` |
| `actions` | `actions.ts` 的 `"<domain>.*"` 键 |
| `permissions` | `permissions.ts` 中 `<domain>:<res>:` 前缀的权限码 |
| `capabilities` | **由上述真实声明推导**（有 facade → `facade.invoke`，有 proto → `rpc.serve`，有 actions → `cmd.dispatch`，`packable` → `pack.independent`） |

**已知限制**：`aigw` / `mall` 的 `displayName` 回退为域名——这两个域不在 `admin-menu.ts`
顶层（`aigw` 的标签在自己的 `contract/menu-catalog.ts` 里）。为两个域写一套「按域解析
各自菜单目录」的机制超出 P0 范围，留待 P1 统一。

**副产品**：该 manifest 顺带量化了各域真实体量（如 `system` 119 个 facade 方法 / 71 个权限码，
`infra` 47 / 36），可作为域拆分与能力盘点的输入。

### P1 实现说明（网关已完成，slot 宿主暂缓）

**已完成 —— 插件 API 网关**

| 件 | 位置 |
|---|---|
| 静态注册表索引（生成物） | `src/modules/shared/contract/plugin-registry.generated.ts` |
| 注册表与路由解析 | `src/modules/shared/backend/plugins/plugin-registry.ts` |
| 网关 | `GET /api/v1/admin/plugins`；`GET`、`POST` `/api/v1/admin/plugins/<domain>[/<method>]` |

**复用而非新造**：派发链完全走既有原语 ——
`ensureContractActions(domain)` 注册该域 action schema →
`applyActionSchema('<domain>.<method>')` 按声明校验入参（满足 §4.3）→
`invokeAction(domain, method)` 走既有的同进程 SDK / 跨进程 RPC 双模。

**两个刻意的决定**：

1. **挂在 `/api/v1/admin/` 下，而不是新开 `/api/plugins/`。**
   `src/proxy.ts` 的 matcher 只覆盖 `/api/v1/**`；新开前缀会落在默认鉴权与
   `admin:routes:check` 基线之外，等于凭空造一个未受保护的新攻击面。
   现两条路由在基线中均为 `wrapper`（最强保护类）。
2. **方法必须已在 manifest 声明。** 未声明的 `<domain>/<method>` 直接 404，
   不落到 `invokeAction` 的动态兜底上 —— 否则「声明面」形同虚设，可被绕过。

**slot 宿主为什么暂缓**：本仓目前**不存在任何插件 UI bundle**（没有外置插件包）。
此时实现 slot 宿主就是**无人使用的脚手架** —— 这正是本仓 §19 禁止、
也是我在 rome-all 那份「4 层测试脚手架」上刚批评过的问题（无引用 + 依赖缺失）。
等第一个真实插件 UI 出现时再实现，届时才有可验证的对象。

## 5. 建议

1. **不要一次性重写。** Facade + 契约 + broker + seam-graph 已把插件架构的前置条件完成了大半，
   真正的增量只有「装载层」。按 P0→P3 推进，每阶段都能独立验收。
2. **P0 优先且应立刻做**：它零风险、产出可评审资产，且是后续所有阶段的地基。
3. **与现有治理门禁对齐**：新引入的 manifest 必须纳入 `compat:check` / `foundation:ontology:check`
   口径，否则又是一个「写进 AGENTS.md 但没人执行」的条款（§6.3 的教训）。
4. **不要为了插件化牺牲已有能力**：本仓的 `BaseMapper` / `QueryWrapper` / 8 大审计底座字段
   是 §19 明确要求复用的资产，插件化必须继续复用，不得借重构之名回退。

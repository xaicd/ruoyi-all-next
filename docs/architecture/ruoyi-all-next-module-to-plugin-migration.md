# Module 架构 → Plugin 架构 迁移设计

> 参考实现：Paperclip（`paperclipai/paperclip`，本地 fork 见 `workspace/xaicd/coolie`）
> 权威规范：`doc/plugins/PLUGIN_SPEC.md`（1846 行）
> 状态：**设计草案**。本文只做架构分析与路线，不含实现承诺。

## 0. 先修正框架：本仓的 domain 对应的是 Platform Module，不是 Plugin

Paperclip 在 `§6 Extension Classes` 明确划分了**两个**扩展类，定位完全不同：

| 维度 | §6.1 Platform Module | §6.2 Plugin |
|---|---|---|
| 信任 | trusted | **capability-gated** |
| 进程 | **in-process** | **out-of-process worker** |
| 接入方式 | **显式注册表**（`registerAgentAdapter()` / `registerStorageProvider()` / `registerSecretProvider()` / `registerRunLogStore()`），**不走插件 worker 协议** | 插件运行时 + host-worker 协议 |
| 数据 | 一方表（first-party tables） | 通用扩展表（`plugin_state` 等），**不允许任意迁移** |
| 定位 | 需要直接进程/DB 集成的宿主内部系统 | 全局安装的**加法式**扩展 |

**本仓 `src/modules/<domain>` 对应的是 §6.1 Platform Module**（可信、进程内、有独立业务表、需要直接 DB 集成），
而不是 §6.2 Plugin。

因此「把 module 架构改成 plugin 架构」这个命题需要重构：**不是把域改造成插件，而是并列引入第二个扩展类**。
Paperclip 自己就是两者并存（core platform modules + 插件），并且 `§9` 规定加载顺序为
core platform modules → built-in first-party plugins → installed plugins。

### 那本仓已有的一半是什么

本仓的 Domain Facade / `.proto` / `actions` / `route.manifest` / `domain-catalog` / seam-graph / broker
——这些是**Platform Module 的显式注册表**，恰好对应 §6.1 的做法（`register*` 系列）。
它们**已经是正确的一侧**，不需要被"改造成插件"。

### 真正缺的是 §6.2 那一侧

一个可安装的插件运行时：manifest 安装与校验、per-plugin worker 进程、capability 强制、
通用扩展表状态、UI slot 宿主、生命周期（install/upgrade/enable/disable）。

## 1. 两种架构的本质差异（保留，用于对照）

| 维度 | 本仓现状（module） | Paperclip Plugin（§6.2） |
|---|---|---|
| 组合方式 | **静态**：域代码编译进同一个 Next 应用 | **动态**：manifest 声明 + 外部包 + 运行时加载 |
| 契约真源 | Domain Facade + `.proto` + `actions.ts` | `PaperclipPluginManifestV1` |
| 隔离级别 | 逻辑隔离（Facade / broker），**单进程** | **一插件一 worker 进程**；host↔worker 走 **stdio JSON-RPC**（§12.1） |
| 数据 | 单库单 schema，一方表 | **默认落通用扩展表**；任意第三方迁移**不在范围内**（§21.1/§21.5） |
| UI | App Router 文件路径 | **预构建 ESM bundle**，host 从 `/_plugins/:pluginId/ui/*` 动态 import，按 `exportName` 挂载（§19.0.3）；非 iframe |
| 权限 | permission code | **capability**：强制静态声明，宿主在 SDK 层拒绝越权调用（§15） |
| 状态 | 各域自有业务表 | `plugin_state` 五段复合键 scoped KV（§21.3） |
| 生命周期 | 编译期 | install → validate manifest → 拒绝不兼容 apiVersion → **向操作员展示申请的 capability** → 启动 worker + health → ready/error（§8.3） |

### 值得直接照搬的几个硬性设计

1. **capability 强制在 SDK 层**（§15）：不是"调用点各自判断"，而是宿主统一拒绝授权集之外的调用。
   且**升级若新增 capability** → 标 `upgrade_pending` → **操作员显式批准**前不得 ready（§15.3）。
   本仓当前只做到"声明 + 单一判定点"，没有升级审批。
2. **禁忌能力清单**（§15.2）：宿主**不得**暴露审批决策、预算覆盖、**鉴权绕过**、检出锁覆盖、**直接 DB 访问**。
   本仓若要引入插件，这条必须前置落地。
3. **UI slot ID 按 plugin ID 自动命名空间化**（§9）：跨插件冲突**结构上不可能**；同一 manifest 内重复 slot ID → 安装时即拒。
   这比"约定前缀"强得多。
4. **`onEvent` 至少一次投递**（§13.5）：插件必须幂等，无全局顺序保证，per-entity 顺序 best-effort。
5. **插件不直连 DB、不读原始密钥**（§14/§22）：密钥只存 `{type:"secret_ref", secretId, version?}`，
   执行时解析并写 `secret_access_events`。
6. **优雅停机阶梯**（§12.5）：`shutdown()` → 10s → SIGTERM → 5s → SIGKILL；在途 job 标 `cancelled`。
7. **失败隔离**（§12.4）：单个 worker 失败只标该插件 `error` + 有界退避重试，不影响其它插件与核心。

## 2. 本仓已有的「准插件」资产（迁移的最大有利条件）

| 已有资产 | 对应物 |
|---|---|
| Domain Facade | Platform Module 的显式注册面（§6.1 一侧，已正确） |
| route manifest + `.proto` + `actions.ts` | 可复用来生成插件 manifest 的 `apiRoutes` / `tools` 声明 |
| `domain-catalog.json` | 域注册表（Platform Module 清单） |
| seam-graph | 域间耦合图 |
| broker / serviceBus（`ruoyi.cmd.<domain>.<method>`） | 与 worker 通信的 subject 寻址——**已同构** |
| 本体域导航 + `foundation:ontology:check` | Paperclip 亦以 `packages/ontology-core` 承载本体 |

## 3. 五个硬缺口（要引入 §6.2 插件侧才需解决）

1. **动态 API 装载**：App Router 是静态文件路由 → 需统一 catch-all 网关按 manifest 分发。
   Paperclip 的形态：`/api/plugins/:pluginId/api/*`，JSON-only，**插件不得遮蔽核心路由**。
2. **UI slot 宿主**：需 bridge + 按 `exportName` 动态 import 插件预构建 ESM bundle。
3. **状态隔离**：需 `plugin_state` 式五段 scoped KV，**而不是给每个域开 DB namespace**。
4. **权限 → capability**：把 permission code 与 manifest `capabilities` 建立映射，并在 SDK 层做交集强制。
5. **worker 运行时**：进程管理 + stdio JSON-RPC + 健康检查 + 停机阶梯 + 失败隔离。

## 4. 分阶段路线（修正版）

原来的 P2b「插件化域引入 namespace 迁移」**方向错误**，已删除 —— 依据 §21.1（插件数据先落通用扩展表）
与 §21.5（不允许任意第三方迁移；`database.namespace.*` 仅对受信任编排插件开放，且 namespace 由宿主派生）。

| 阶段 | 内容 | 状态 |
|---|---|---|
| **P0** | manifest 生成器：聚合既有真源产出每域 `plugin.manifest.json` + 静态注册表索引 + 漂移门禁 | ✅ 已完成 |
| **P1** | 插件 API 网关（按 manifest 分发，复用 `invokeAction` 双模）+ capability 强制 | ✅ 网关与能力判定已完成；UI slot 宿主暂缓 |
| **P2（修正）** | **引入插件状态表**（`plugin_state` 式五段 scoped KV）+ 插件注册表持久化（`plugins` 表）+ 生命周期（install/enable/disable/upgrade_pending） | 未开始 |
| **P3** | **per-plugin worker 进程**（stdio JSON-RPC、健康检查、停机阶梯、失败隔离）；broker 从进程内切跨进程 | 未开始 |
| **P4** | **UI slot 宿主**：bridge（`getData`/`performAction`）+ `/_plugins/:pluginId/ui/*` 静态分发 + 按 `exportName` 动态 import | 未开始 |

### P0 实现说明

产物：`src/modules/<domain>/contract/plugin.manifest.json`（16 份；`online` 为 handwritten 跳过）。
入口：`npm run domain:manifests`（与 route manifest 同一条管线）。
漂移门禁：`npm run domain:manifests:check`，置于 `check` 的 `contracts:sync` **之前**
（因为 `contracts:sync` 会重新生成，放其后永远通过）。

**设计要点：不引入第二份真源。** 每个字段都从仓库既有文件解析：

| manifest 字段 | 真源 |
|---|---|
| `kind/stage/owner/auth/messaging/invoke/pack/dependsOn/upstream` | `domain-catalog.json` |
| `displayName` | `admin-menu.ts` 顶层 `key`+`label` |
| `facadeMethods` | `<domain>*.facade.ts` 的 `*_FACADE_METHODS` |
| `rpc` | `<domain>.proto` 的 `service`/`rpc` |
| `actions` | `actions.ts` 的 `"<domain>.*"` 键 |
| `permissions` | `permissions.ts` 中 `<domain>:<res>:` 前缀 |
| `capabilities` | 由上述真实声明推导（有 facade → `facade.invoke` 等） |

**已知限制**：`aigw` / `mall` 的 `displayName` 回退为域名（不在 `admin-menu.ts` 顶层）。

### P1 实现说明

| 件 | 位置 |
|---|---|
| 静态注册表索引（生成物） | `src/app/api/v1/admin/plugins/_lib/plugin-registry.generated.ts` |
| 注册表与路由解析 | `src/app/api/v1/admin/plugins/_lib/plugin-registry.ts` |
| 网关 | `GET /api/v1/admin/plugins`；`GET`、`POST` `/api/v1/admin/plugins/<domain>[/<method>]` |

**为什么注册表住在 `src/app`（组合根）而不是 `modules/shared`**：初版实现的分层错误，已修正。
`shared` 是 L0 基础 SDK，依赖纪律是「只允许依赖 `system`/`infra` 的平台/公开面，其余走动态 import」，
而注册表**静态 import 全部 16 个域**，把依赖方向倒了过来。更关键的是有实害：`domain:pack` 只打包
`[domain, ...dependsOnModules]`，索引若在 `shared` 内，打包后会 import 到未随包拷贝的其它域而构建失败。

**与 Paperclip 的差异（当前未对齐项）**：
- 挂在 `/api/v1/admin/` 下而非 `/api/plugins/`。理由：`proxy.ts` matcher 只覆盖 `/api/v1/**`，
  新前缀会落在默认鉴权与 `admin:routes:check` 基线之外，凭空造未受保护面。
  若将来要贴齐 Paperclip 的 `/api/plugins/*`，必须同时把该前缀纳入鉴权 matcher 与路由基线。
- 只支持 `<domain>/<method>` 两级；Paperclip 的是插件自有 `apiRoutes` 子路径（含
  `auth` / `checkoutPolicy` / `companyResolution` 声明）。子路径属 P4。

## 5. 建议

1. **不要把域改造成插件。** 它们是 §6.1 的 Platform Module，改造会丢掉一方表、事务与直接 DB 集成，
   而 Paperclip 的插件模型恰恰**不允许**这些东西（§15.2 禁直接 DB 访问、§21.5 禁任意迁移）。
2. **要引入的是并列的第二个扩展类**，从 P2（状态表 + 生命周期）开始，再 P3（worker 进程）。
3. **P1 的 capability 强制要向 §15.3 对齐**：补"升级新增 capability 需操作员显式批准"。
4. **UI slot 宿主（P4）在出现第一个真实插件 UI 前不实现** —— 无验证对象，只会得到无人使用的脚手架。
5. 新引入的 manifest 必须纳入 `compat:check` / `foundation:ontology:check` 口径，否则重演「写进 AGENTS.md 却没人执行」。
6. **不要为了插件化牺牲已有能力**：`BaseMapper` / `QueryWrapper` / 8 大审计底座字段是 §19 明确要求复用的资产。

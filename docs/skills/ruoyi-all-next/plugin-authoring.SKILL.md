---
name: plugin-authoring
description: 编写、安装、排障与评审 §6.2 可安装插件（插件包结构、manifest 契约、capability 白名单、worker stdio 协议、生命周期状态机）。接到"写插件/装插件/插件报错了/manifest 怎么填/插件和 module 有什么区别"时启用。
---

# 插件编写与接入规范 (Plugin Authoring & Installation)

## 1. 适用场景

- 要**写**一个新插件（第三方扩展、客户定制能力、按客户隔离的功能包）。
- 要**装**一个插件进实例，或排查"装了但状态不是 ready"。
- 要评审某段扩展代码：它应该是 Plugin，还是 Platform Module？

**先做这个判断，方向错了后面全错。**

## 2. 第一决策：Plugin 还是 Platform Module

本仓有**两个平行的扩展类**，不是同一个东西的两种写法。

| 维度 | Platform Module（域） | Plugin（插件） |
|---|---|---|
| 信任 | 可信 | **capability 受限** |
| 进程 | 与宿主同进程 | **独立 worker 进程** |
| 落位 | `packages/domains/<domain>/` | 实例插件目录（`RUOYI_PLUGIN_DIR`） |
| 声明面 | `contract/module.manifest.json`（**派生生成**，勿手改） | 插件包内 `plugin.manifest.json`（**手写**） |
| 调用方式 | Domain Facade / broker / serviceBus | capability 白名单内的宿主 API |
| 数据库 | 自有表 + 迁移 | **禁止直连 DB**，走宿主扩展表 |
| 谁能加 | 平台研发 | 第三方 / 客户 |

**判断规则：**

- 要改核心业务、要加表、要别的域调用它 → **Platform Module**（走 `new-feature` skill）。
- 客户定制、按实例启停、来源不完全可信、要进程级隔离 → **Plugin**（本 skill）。

**不要**把域改造成插件。域是平台的组成部分，插件是可装卸的扩展。

## 3. 插件包结构

一个插件包 = 一个 npm 包目录。宿主**不从源码树读插件**，只读插件目录。

```
<插件目录>/<你的插件>/
├── package.json          ← 必须含 ruoyiPlugin 指针
├── plugin.manifest.json  ← 必须；必须是 JSON（不能是 .js）
├── worker.js             ← 可选；独立运行入口（out-of-process，stdio JSON-RPC）
├── merged.js             ← 可选；合并运行入口（in-process，宿主直接 import）
└── (可选) ui/            ← 预构建 UI bundle；宿主不编译，只静态分发

**worker 与 merged 至少声明一个**；两个都声明 = 该插件同时支持两种形态。
```

`package.json` 的入口指针（键名固定 **`ruoyiPlugin`**）：

```json
{
  "name": "@yourorg/plugin-foo",
  "type": "module",
  "ruoyiPlugin": {
    "manifest": "./plugin.manifest.json",
    "worker": "./worker.js",
    "merged": "./merged.js"
  }
}
```

**硬性要求：**

1. `manifest` 必须是 **JSON 文件**。宿主若允许 JS 模块，读 manifest 就等于在宿主进程里执行你的代码 —— 这条不会放开。
2. `manifest` / `worker` 路径**必须落在插件包目录内**。用 `../` 越界会被拒（防路径穿越）。
3. `worker` 指向的文件必须**真实存在**，否则安装期就被拒。
4. worker 里 `import` 的依赖必须能从插件包位置上溯解析到（宿主不代你安装依赖）。

参考实现：`packages/plugins/examples/hello-world/`（最小可运行示例）。

## 4. manifest 契约

```json
{
  "id": "yourorg.foo",
  "apiVersion": 1,
  "version": "0.1.0",
  "displayName": "Foo",
  "description": "一句话说明",
  "author": "Your Org",
  "categories": ["automation"],
  "capabilities": ["plugin.state.read"],
  "entrypoints": { "worker": "./worker.js" }
}
```

| 字段 | 规则 |
|---|---|
| `id` | `/^[a-z0-9][a-z0-9._-]{1,127}$/`，建议 `<org>.<name>` |
| `apiVersion` | **必须精确等于宿主值（当前 1）**，不做范围推断，不匹配即拒装 |
| `version` | semver |
| `categories` | `connector` / `workspace` / `automation` / `ui` 至少一个 |
| `capabilities` | 见下节，**声明是请求，不是授权** |
| `entrypoints.worker` | 必填 |
| `entrypoints.ui` | 可选；**声明了 `ui.slots` 就必须填**，否则宿主无处加载组件 |
| `ui.slots[].id` | 同一 manifest 内不可重复（跨插件重复由宿主命名空间化，不必自己加前缀） |

## 5. capability：白名单 + 禁忌清单

**白名单（只能声明这些）：**

`api.routes.register`、`events.subscribe`、`http.outbound`、`jobs.schedule`、
`plugin.state.read`、`plugin.state.write`、`ui.page.register`、`webhooks.receive`

**禁忌（声明即拒，且拒绝理由会明确写"属禁忌能力"而不是含糊的"未知能力"）：**

`auth.bypass`、`budget.override`、`database.direct`、`issue.checkout_override`

**只声明你真正要用的能力。** 未在白名单内的能力一律拒装；重复声明也拒。
宿主在网关派发处按声明的 capability 做授权判定 —— 没声明就调，得到的是 403。

> 现状边界（不要假设更多）：capability 目前在**网关派发**处强制，尚未下沉到 SDK 内部。
> 因此"声明了 A 却去用 B"不会被 SDK 拦住。写插件时请自行遵守声明，别把它当成沙箱。

## 6. worker 协议

宿主与 worker 之间走 **stdio 上的逐行 JSON-RPC**：一行一个 JSON 对象，`\n` 分隔。

**三个必选方法**（缺任一个即不合格 worker）：

| 方法 | 语义 |
|---|---|
| `initialize` | 启动时调一次。参数含 `manifest` / `config` / `hostApiVersion` / `instance` |
| `health` | 返回 `{ status: "ok" \| "degraded" \| "error", message?, diagnostics? }` |
| `shutdown` | 收到后应尽快自行退出 |

**用 SDK 就不用手写这些：**

```js
import { definePlugin, runWorker } from "@ruoyi/plugin-sdk"

const plugin = definePlugin({
  async setup(ctx) { ctx.logger.info("ready") },
  async onHealth() { return { status: "ok" } },
  async onShutdown() { /* 快速收尾 */ },
})

runWorker(plugin)
```

**两条必须遵守的约定：**

1. **stdout 只走协议，诊断信息一律写 stderr。** 往 stdout 打普通日志会污染协议流。
2. **不要自己实现并发调度。** 协议的 dispatch 是严格按序的 —— `initialize` 必须最先、
   `shutdown` 必须最后。若你绕过 SDK 自己写，务必保证同样的顺序：早期实现因为并发分发，
   导致 `health`/`shutdown` 的响应先于 `initialize` 返回，`health` 还会误报"尚未 initialize"。

**宿主侧时限（可配）：** 单请求 15s；`initialize` 20s；停机阶梯 `shutdown()` → 10s → SIGTERM → 5s → SIGKILL。

## 6.5 运行形态：独立（isolated）与合并（merged）

**一份业务逻辑，两种跑法** —— 与域的双模 Facade（同进程 SDK ↔ 跨进程 RPC）是同一个原则。
你在 SDK 里只写一份 handler，两种形态由**宿主**按插件实例的 `runtimeMode` 决定：

| | `isolated`（默认） | `merged` |
|---|---|---|
| 进程 | 独立子进程 | 与宿主同进程 |
| 传输 | stdio 逐行 JSON-RPC | 直接函数调用 |
| 隔离 | ✅ 插件崩溃/挂死**只影响自己**（宿主有超时与停机阶梯） | ❌ 插件崩溃/死循环**会带走宿主** |
| 入口 | `entrypoints.worker` | `entrypoints.merged` |
| 适用 | 第三方 / 来源不完全可信 | 第一方 / 自研，且要零 IPC 开销 |

**关键约束：能不能合并是运营的选择，不是插件说了算。**
宿主侧的 `plugin.runtime_mode` 决定形态；你只能通过"是否声明 merged 入口"表达**能力**：

- 只声明 `worker` → 只能独立跑
- 只声明 `merged` → 只能合并跑
- 两个都声明 → 由运营按插件配置选择（默认 isolated）

宿主对不匹配的配置**报错而不静默降级**：比如运营把插件配成 `merged`，而 manifest 没声明
`merged` 入口 → 该插件状态置 `error` 并给出明确原因。

**合并入口的写法**：不要 import SDK 的 `runWorker`（那是 stdio 专用），
只要把 handler 对象**导出**即可：

```js
import { definePlugin } from "@ruoyi/plugin-sdk"

export default definePlugin({
  async setup(ctx) { ctx.logger.info("ready") },   // ctx.mode === "merged"
  async onHealth() { return { status: "ok" } },
  async onShutdown() {},
})
```

宿主接受 `default` 或 `plugin` 具名导出。

## 7. 生命周期状态机

```
磁盘扫描通过 ──> installed ──> ready        （worker 起来且 initialize 成功）
                    │
                    └────────> error        （任一环节失败，原因写 lastError）
```

- 扫描不过的包**不落库**（它出现在 `rejected` 里，理由就是诊断面）。
- 状态**只由生命周期推进**：重新同步磁盘**不会**把 `error` 悄悄重置回 `installed`。
- 插件包从磁盘消失 → 逻辑删除并标 `error`，**不会继续谎报 ready**。

> 尚未实现：`upgrade_pending` → 运营显式批准新增 capability 后才转 `ready` 的升级审批流。
> 当前升级直接走 `installed → ready`。**不要**假设新增 capability 前会有一次审批。

## 8. 安装与验证

```bash
# 1. 把插件包放进实例插件目录（默认 .ruoyi/plugins，已 gitignore）
#    或用 RUOYI_PLUGIN_DIR 指定别处
# 2. 触发扫描 + 启停 worker（需要 PLATFORM_PLUGIN_MANAGE 权限）
curl -X POST /api/v1/admin/plugins
# 3. 看状态（需要 PLATFORM_PLUGIN_QUERY 权限）
curl /api/v1/admin/plugins
```

响应里三类信息都要看：

- `plugins[].status` —— 期望 `ready`
- `plugins[].lastError` —— 非 null 就是失败原因
- `rejected[]` —— **被拒的包不落库**，只能从这里看到，容易漏看

## 9. 常见拒装原因速查

| 现象 | 原因 |
|---|---|
| `缺少合法的 ruoyiPlugin 指针` | `package.json` 没有 `ruoyiPlugin`，或缺 `manifest`/`worker` 字段 |
| `apiVersion N 与宿主支持的 1 不兼容` | 精确匹配失败，改 `apiVersion` |
| `capability "x" 不在宿主能力白名单内` | 拼写错，或该能力确实不提供 |
| `capability "x" 属禁忌能力` | 你在申请宿主明确不给的能力 |
| `entrypoints.worker 指向的路径不存在` | 路径写错，或忘了提交该文件 |
| `manifest 越出插件包目录` | 用了 `../` |
| 状态 `error` 且 lastError 提 spawn/超时 | worker 起不来、没回应 `initialize`、或语法/依赖解析错误（看 worker 的 stderr） |

## 10. 禁止项

1. 禁止把 manifest 写成 `.js` 模块（只接受 JSON）。
2. 禁止用 `../` 让 manifest / worker 越出插件包目录。
3. 禁止往 stdout 写非协议内容。
4. 禁止直连**宿主**数据库（含用宿主的 DB 客户端）—— capability `database.direct` 会被拒。
   **但这不是说插件永远不能有自己的存储**：插件自有数据的默认落点是宿主的通用扩展表
   （`plugin_state` / `plugin_config`，按插件与租户隔离，宿主保证作用域）。
   "插件拥有独立库"是另一件独立的事（独立库名 + 自己的表结构），需要宿主在**供给凭据与
   生命周期**上配套；在当前版本尚未提供，届时会以独立 capability 开放，而不是把宿主库连接串给你。
5. 禁止假设 cap A 能换 cap B 的权限：只声明你要用的。
6. 禁止把域的能力塞进插件来实现（该走 Platform Module）。
7. 禁止为"以后可能需要"声明白名单外的能力 —— 拒装。

## 11. 本 skill 不覆盖（诚实边界）

- **插件 UI slot host 尚未实现**：manifest 可声明 `ui.slots`，宿主会校验，但**还不会渲染**。
- §13 可选方法（`onEvent` / `runJob` / `handleWebhook` / `getData` / `performAction` / `executeTool`）及其声明面未实现。
- manifest 的 `apiRoutes` **已可挂载** ✅ —— 宿主把它们挂到
  `/api/v1/admin/plugins/<pluginKey>/api<path>`，处理器由插件导出（见下）。
  当前**只支持 `auth: "operator"` 与 `merged` 形态**：isolated 形态需要 worker 协议新增
  路由转发方法（未实现，会得到 501）；`public` / `company` 需要先把该路径纳入 proxy 的
  公开策略，否则会在到达挂载层之前被外围拦掉（同样返回 501 并说明原因）。

### 怎么声明与实现路由

manifest：

```json
"capabilities": ["api.routes.register"],
"apiRoutes": [{ "routeKey": "hello", "method": "GET", "path": "/hello", "auth": "operator" }]
```

插件入口导出同名 `routeKey` 的处理器（合并形态）：

```js
export default definePlugin({
  routes: {
    async hello({ method, path, query, body, headers, pluginKey }) {
      return { status: 200, body: { ok: true } }
    },
  },
})
```

约定：**路由声明与处理器都留在插件包内**，宿主只做挂载 —— 这样插件目录才是自包含的，
不必把路由文件塞进宿主 `app/`。
- 插件升级审批流（§15.3）未实现。

### 第一方插件的自带迁移（已实现，但有严格边界）

如果你写的是**第一方**插件（宿主运营明确信任），可以在包内放 `migrations/` 并声明：

```json
"migrations": { "dir": "./migrations" }
```

宿主会在**启动运行时之前**执行它们，三条硬边界：

1. **只执行宿主信任的插件** —— 信任来自运营配置 `RUOYI_TRUSTED_PLUGIN_KEYS`，
   **manifest 不能自封**（否则任何插件都能自带迁移）。未信任则跳过并给出原因。
2. **严格隔离在插件自己的 schema**（`plugin_<插件key>`）。所以迁移里**不要加 schema 限定**：
   未限定的表名会落在你自己的 schema 里，`public`（宿主表）对你不可见。
   带 `public.` 限定、`DROP SCHEMA`、`GRANT/REVOKE`、角色/扩展 DDL、`ALTER SYSTEM`、
   `COPY ... PROGRAM`、写 `pg_*` 系统目录 —— 这些会被宿主**静态拒绝**（注释里的字样不算）。
3. **幂等**：按文件名记录，同名文件不重复执行。宿主不假定迁移文件不可变。

第三方插件不要用这条路 —— 走 `plugin_state` / `plugin_config` 扩展表。

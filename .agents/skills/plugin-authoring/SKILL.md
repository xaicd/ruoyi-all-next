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
| 落位 | `src/modules/<domain>/` | 实例插件目录（`RUOYI_PLUGIN_DIR`） |
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
├── worker.js             ← 必须；worker 入口
└── (可选) ui/            ← 预构建 UI bundle；宿主不编译，只静态分发
```

`package.json` 的入口指针（键名固定 **`ruoyiPlugin`**）：

```json
{
  "name": "@yourorg/plugin-foo",
  "type": "module",
  "ruoyiPlugin": {
    "manifest": "./plugin.manifest.json",
    "worker": "./worker.js"
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
4. 禁止在 worker 里直连数据库（含用宿主的 DB 客户端）—— 宿主不提供，申请 `database.direct` 会被拒。
5. 禁止假设 cap A 能换 cap B 的权限：只声明你要用的。
6. 禁止把域的能力塞进插件来实现（该走 Platform Module）。
7. 禁止为"以后可能需要"声明白名单外的能力 —— 拒装。

## 11. 本 skill 不覆盖（诚实边界）

- **插件 UI slot host 尚未实现**：manifest 可声明 `ui.slots`，宿主会校验，但**还不会渲染**。
- §13 可选方法（`onEvent` / `runJob` / `handleWebhook` / `getData` / `performAction` / `executeTool`）及其声明面未实现。
- manifest 的 `apiRoutes` 已在校验范围内，但**宿主尚未挂载**这些路由。
- 插件升级审批流（§15.3）未实现。

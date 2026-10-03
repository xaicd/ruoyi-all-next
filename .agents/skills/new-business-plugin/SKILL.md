---
name: new-business-plugin
description: 从一句业务需求（如"做个电商平台"）到新业务域跑起来的第一方插件全链路：起底座、写表元数据、建表、codegen 生成全栈代码、注册为插件、编译、打包、运行预览。接到"新业务/新平台/加一个业务域/定制 plugin"时启用。
---

# 新业务域 → 第一方插件 全链路交付

## 1. 何时启用

用户说「**要做一个 X 平台 / 加一个业务域 / 定制一块业务**」这类**从零起新域**的需求时。

与其它 Skill 的分工：

| 需求 | 用哪个 |
|---|---|
| 起一个**新工程** | 本 Skill 第 2 步 |
| **新建一个业务域**（新表、新 CRUD、新页面） | **本 Skill** |
| 在**已有域**里加一个功能 | `new-feature` |
| 写/装/排障**第三方插件** | `plugin-authoring` |
| 域的拆分部署与阶段演进 | `microservice-evolution` |

## 2. 定形态（先决定，别默认整仓）

```bash
npm run project:create -- <路径>                     # base（默认）: 只要 system+infra，最轻
npm run project:create -- <路径> --profile minimal   # + online/ai/aigw（要低代码在线表单就选它）
npm run project:create -- <路径> --profile standard  # 整仓 17 个域
npm run project:create -- <路径> --bundle mall,crm   # 只要地基 + 指定业务域
```

**新项目默认只带 `system` + `infra`** —— 加载/运行/预览都快，定制扩展也快；要什么再加。

孵化会自动完成：建库 → 迁移 → **种子（含管理员与菜单）** → 裁剪 → lockfile 同步 →
生成物重建 → 路径重命名 → 自检，并**打印管理员凭据**。

**启动前先清掉 shell 里的同名环境变量**（`DATABASE_URL` / `DB_DRIVER` / `TENANT_*`）——
它们的优先级**高于 `.env`**，不清会连到别的库、或把管理员当租户账号，
表现为「登录说用户名或密码错误」（实测踩过）。

## 3. 一条命令走完（推荐）

写下表元数据之后，**其余步骤由一条命令串起来**（每步幂等、可重复运行）：

```bash
npm run domain:new <域>          # 校验元数据 -> 生成迁移 -> codegen -> 注册插件 -> 重生成 -> 打印后续
npm run domain:new <域> --dry-run  # 只校验元数据与表清单
```

它**不做**三件事（都要人或 CI 决定）：不写元数据（字段类型是产品决策）、
不 `prisma migrate deploy`（目标库由部署决定）、不提交推送。

第 4~7 节是它内部做的事 —— 单独执行其中某步时按那里操作。

## 4. 建表：先写**元数据**（唯一真源，别手写 DDL）

域的表定义写进 `scripts/data/<域>-tables.ts`（`CodegenConfig[]`），列里带上
`type / tsType / nullable / comment`，需要时补 `maxLength / precision / scale /
defaultValueTyped`。

```bash
npx tsx scripts/generate-table-migration.ts \
  --tables scripts/data/<域>-tables.ts --export <X>_TABLES --name add_<域>_tables --write
```

**为什么不能手写 DDL**：`standards:check` 的 `table-definition-coverage` 拦的是
「仓储在查、却没有任何地方创建」的表 —— 那种表在内存回退下全绿、一连真实库就
`relation does not exist`，且**静默**。

## 5. 生成完整代码（低代码，别手抄 CRUD）

```bash
npm run scaffold -- --pack service-pattern --module <域>/<功能> --entity <X> ...
```

或用 codegen 引擎按表批量生成（`CodegenEngineService.generateCodes(config)`），
产出：`contract/`（actions + rbac.sql）、`backend/`（types/validators/repositories/
services/rpc/**tests**）、`frontend/`（api/components/pages）、`src/app/api/v1/admin/<域>/…`
（**真处理器**，已被 `withAdminRoute` 包好）、以及**建表迁移**。

> 生成物已包含 CRUD 全套与测试。**禁止**再手写一遍 —— AGENTS §19「零重复代码」。

## 6. 注册为第一方插件（幂等可续跑）

```bash
node scripts/migrate-domain-to-plugin.cjs <域>            # 先 dry-run 看影响面
node scripts/migrate-domain-to-plugin.cjs <域> --write
```

它做 0~7 步：搬路由处理器进域内 → 生成 manifest+入口 → 移入 `packages/plugins/plugin-<域>`
→ `ruoyiPlugin` 指针 → 静态入口表 → **catalog 登记为 `kind=plugin`** →
`rpc-actions` / `hatch-manifest` / `compat-manifest` / 治理行 → tsconfig+vitest 别名 →
删 Next 转发文件。

**新域（尚未登记）也支持** —— 它会先按插件语义补登记，再走后续步骤。
**可重复运行**：已完成的步骤跳过，未完成的续做。

## 7. 重生成 + 门禁（顺序不能错）

```bash
npm run domain:contracts && npm run domain:seams && npm run domain:manifests && npm run admin:routes:manifest
pnpm install          # 新插件进了工作区
pnpm run check && npx vitest run
```

**顺序**：`contracts` 会重写 `module.manifest.json`，必须跑在 `manifests` **之前** —— 反了就会一直报漂移。

## 8. 编译 / 打包 / 运行预览

```bash
pnpm run build                    # 编译
npm run domain:pack <域>          # 打包 -> dist/domain-packs/<域>
pnpm run dev                      # 运行（或 ./start.sh app）
```

预览：登录 → 侧边栏进入新域页面；接口面是**插件挂载点**
`/api/v1/plugins/ruoyi.<域>/api/**`（**不是** `/api/v1/admin/<域>/...`，后者本就 404）。

**新域第一次要登记插件**（宿主只挂载已登记的）：`POST /api/v1/admin/plugins`。

## 9. 验收清单（做完逐条打勾）

- [ ] 表元数据已写，迁移已生成**并 `prisma migrate deploy` 到库**
- [ ] codegen/脚手架产出含 **CRUD + 校验 + 测试**，不是只读骨架
- [ ] 插件 manifest 的声明面与入口实现面**一一对应**
- [ ] `pnpm run check` **exit=0**（含 `table-definition-coverage`）
- [ ] `npx vitest run` 内存模式全绿
- [ ] `pnpm run build` exit=0
- [ ] 启动后：登录成功，插件挂载点接口返回 **200**（不是 404/500）

## 10. 禁止项

1. 手写重复 CRUD / 重复 DDL —— 用元数据 + 生成器，先检索已有工具。
2. 写死路径（`packages/domains/...`）—— 用共享解析器；写死的后果通常**不是报错，而是静默失效**。
3. 把定制业务放进**基座**（基座只建 RuoYi 原生域）。
4. 生成物手改 —— 一律让生成器重建。
5. 跳过 `npm run check`。

## 11. 权威文档

`AGENTS.md`（§3.2 目录与插件、§9.5 表定义真源、§14 代码生成、§17 基座边界、§19 零浪费）、
`docs/architecture/artifacts/source-parity-report.md`（与源框架的能力对账）、
`npm run domains:capabilities`（按域盘点）。

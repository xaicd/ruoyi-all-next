# 任务：电商平台

上游：`design.md`。规格变化必须退回规划阶段（§6.1）。

> **两条硬规矩**（对齐 CMMI「主线-支线任务树」与「1 Task = 1 Commit」）:
> 1. **归属**必须写 `main`（主线）或某个已存在的任务 ID —— **不允许孤儿任务**
> 2. **文件白名单**必填（逗号分隔）；`-` 表示该任务不改文件（纯验证类）
>
> 完成度**不看"状态"列**，而是从 git 推导：commit message 带 `[T<ID>]`（方括号，避免误匹配）且改动文件落在
> 白名单内，才算这条任务真的做了（`npm run task:verify`）。

| ID | 归属 | 任务 | 文件白名单 | 状态 |
|---|---|---|---|---|
| T1 | main | 表定义元数据（表与列的真源） | scripts/data/shop-tables.ts | 未开始 |
| T2 | T1 | 建域：建表迁移 + codegen + 注册插件 | packages/plugins/plugin-shop/**, src/app/(admin-pages)/admin/shop/**, scripts/data/shop-tables.ts | 未开始 |
| T3 | T1 | 门禁全绿（check / build / pack） | - | 未开始 |
| T4 | main | 建库与种子：表、菜单、授权落地 | prisma/migrations/** | 未开始 |
| T5 | T4 | 运行与预览：侧边栏可见、插件接口 200 | - | 未开始 |
| T6 | main | 业务逻辑：库存预占（不超卖） | packages/plugins/plugin-shop/backend/services/shop-order-ops.ts | 未开始 |
| T7 | T6 | 业务逻辑：订单状态机 + 回调幂等 | packages/plugins/plugin-shop/backend/services/shop-order-ops.ts, packages/plugins/plugin-shop/backend/services/__tests__/shop-order-ops.test.ts | 未开始 |
| T8 | T6 | 真实库用例（并发扣减只有一个成功） | packages/plugins/plugin-shop/backend/services/__tests__/** | 未开始 |
| T9 | main | 运营：agent 契约 + 体检/造数/清数 | packages/plugins/plugin-shop/agent/** | 未开始 |
| T10 | main | C 端商品列表（schema 驱动） | clients/expo/src/api/shop/**, packages/shared/contract/page-schemas.generated.ts | 未开始 |

## 依赖

    T1 → T2 → T3        T4 → T5
    T1 ─────────→ T10
    T6 → {T7, T8}       T9 独立

## 阶段状态

* 规划：`PLAN_APPROVED`（selection / requirements / design / prototype / tasks 已产出）
* 开发：待 T2 起（当前 `evidence.json` 里 G2/G3 为 blocked）
* 独立测试：待 T8

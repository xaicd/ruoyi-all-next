# 设计：电商平台（shop）

上游：`docs/features/ecommerce/requirements.md`（本文件不得反向修改需求）

## 1. 架构

shop 是**第一方插件**（`packages/plugins/plugin-shop`），挂在 `/api/v1/plugins/ruoyi.shop/api/**`。

    C 端 (clients/expo)          运营端 (admin)
            │                          │
            └──────── HTTP ────────────┘
                        │
                 shop 域（本插件）
              ┌─────────┴─────────┐
       shop_product          shop_order
              │                   │
              │ 下单预占            │ 支付回调
              ▼                   ▼
        wmsFacade.lockStock   payFacade（回调状态机）
        wmsFacade.deductStock
        wmsFacade.releaseStock

**跨域只走 Facade**（需求 §4）。库存与支付的状态机**已存在**，shop 复用而不是重写。

## 2. 数据

| 表 | 关键列 | 说明 |
|---|---|---|
| `shop_product` | id(text) / name / price / status / tenant_id / 审计 6 列 | 商品；id 一律 **text**（本仓约定） |
| `shop_order` | id / product_id / quantity / amount / status / tenant_id / 审计 | 订单 |

* 表定义真源 = **低代码元数据**（`scripts/data/shop-tables.ts`），不手写 DDL（AGENTS §9.5）
* 状态列在库里用**可读字符串**（本域自建，未沿用源框架的整数枚举）

## 3. 关键不变量（设计与验收一一对应）

1. **不超卖** → 预占/扣减走 `wmsFacade`，它是**条件更新**（`WHERE qty >= n`），影响 0 行即拒绝
2. **回调幂等** → 复用 pay 的状态机（`applyPaidCallback` 的 `emitEvent` 只在首次为 true）
3. **状态机** → `shop_order`: `PENDING → PAID → CLOSED`（仅退款），用 shared 的 `defineStateMachine` 声明

## 4. UI

| 端 | 页面 | 复用 |
|---|---|---|
| admin | 商品列表（搜索/新增/编辑/上下架/删除） | `new-business-plugin` 生成的列表页 + 表单弹窗 |
| admin | 订单列表（按状态筛选） | 同上 |
| C 端 | 商品列表 / 详情 | **schema 驱动**（Agent 契约生成 `page-schema`，无需手写） |

UI 规范按 AGENTS §5.2（Header/搜索栏/表格/操作列）；**Agent-Native 属性**由生成器产出。

## 5. 运维与运营

* 门禁: `npm run check` → `verify:real-db` → `build`
* 运营: `agent:ops` 用 shop 的 Agent 契约做**接口体检 + 造/清样例数据**
* 保护: 下单与支付回调路由声明 `idempotent: true`（复用 `withAdminRoute` 的声明式防护）

## 6. 风险

| 风险 | 处理 |
|---|---|
| 库存扣减与订单创建不在同一事务 | 先预占后建单；失败则释放预占（补偿） |
| 支付回调与订单状态并发 | 状态机 + 条件更新（只用首次回调发事件） |
| shop 表与已有 shop（本项目自建）冲突 | 域名为定制域，不进基座 catalog 的原生域清单 |

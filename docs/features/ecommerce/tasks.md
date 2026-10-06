# 任务：电商平台（shop）

上游：`design.md`。规格变化必须退回规划阶段（AGENTS §6.1）。

## 任务 DAG

- [ ] T1 元数据：`scripts/data/shop-tables.ts`（`shop_product` / `shop_order`）
- [ ] T2 建域：`npm run domain:new shop`（建表迁移 + codegen + 注册插件）
- [ ] T3 门禁：`npm run check` exit=0
- [ ] T4 编译：`npm run build` exit=0
- [ ] T5 打包：`npm run domain:pack shop`
- [ ] T6 建库：`prisma migrate deploy` + 种子 → 表与菜单落地
- [ ] T7 运行：起服务 → 登录 → 侧边栏可见 shop → 插件接口 200
- [ ] T8 测试：真实库用例（内存 + 真实库两种模式）
- [ ] T9 运营：`npm run agent:ops -- shop.ShopProduct health` / `seed-sample` / `purge-sample`
- [ ] T10 业务逻辑：库存预占与订单状态机接 Facade（本批次的**核心交付**）

## 依赖

    T1 → T2 → T3 → T4 → T5
              └→ T6 → T7 → T8/T9
                              └→ T10（业务逻辑，独立可并行）

## 阶段状态

* 规划：`PLAN_APPROVED`（requirements/design/tasks 已产出）
* 开发：待 T2 起
* 独立测试：待 T8

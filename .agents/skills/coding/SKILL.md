---
name: coding
description: Modules-First 分层编码、CRUD 生成规范、事务与状态机落地。
---

# 编码实现与工程分层规范

## 1. 适用场景
- 编写 API Route、业务 Service、Validator、Repository 与前端页面。
- 扩展现有模块能力或接入代码生成器产物。

## 2. 权威依据
- `AGENTS.md` §4 (编码规范：Route/Service/Validator/权限/日志)
- `AGENTS.md` §5 (Domain-First 研发流程六要素：API / Service / Validator / Page / Permission / Log+Test)
- `AGENTS.md` §11 (代码规模与拆分约束：单文件 > 200 行拆子服务)
- `AGENTS.md` §14 (代码生成器架构规范与目录分层)
- `docs/guides/service-design-patterns.md`

## 3. 标准 Modules-First 目录规范
```
src/modules/{domain}/
├── contract/
│   ├── {entity}.actions.ts            ← 契约 Schema (HTTP 与 Broker 共享)
│   └── {domain}.facade.ts            ← 领域门面 (对外暴露的唯一同步入口)
├── backend/
│   ├── types/{entity}.types.ts        ← 领域实体与 DTO 定义
│   ├── validators/{entity}.validator.ts ← Zod 验证器
│   ├── repositories/{entity}.repository.ts ← Kysely + 内存回退仓储
│   ├── services/{entity}.service.ts    ← 核心业务逻辑 (事务、状态机、审计)
│   └── services/__tests__/{entity}.test.ts ← Vitest 自动化测试
└── frontend/
    ├── api/{entity}.api.ts            ← 前端 API 封装 (三端共用 SDK)
    ├── components/{Entity}Form.tsx    ← 弹窗/表单组件
    ├── pages/{entity}-list.page.tsx   ← 🔴 Admin 运营管理端页面
    └── cpc-pages/{feature}.cpc-page.tsx ← 🟢 CPC 客户/政企挂载/C端 PC 页面
```

## 4. 标准分层职责清单
- **Route 层（`src/app/api/v1/**/route.ts`）**：
  - 纯粹的协议适配层（薄层）：解析 Query/Body -> 鉴权与权限校验 -> 调用对应 Service -> 返回统一封装。
  - **严禁**在此编写业务编排、开启事务或手写 SQL。
- **Service 层（`modules/<domain>/backend/services`）**：
  - 业务核心逻辑闭环：参数二次校验、状态守卫检查、开启数据库事务、记录 Event/Audit 结构化日志。
- **Repository 层（`modules/<domain>/backend/repositories`）**：
  - 数据持久化：执行参数化 SQL / Kysely 构建，处理租户条件过滤。

## 5. 绝对禁止项
- 严禁使用 `any` 糊弄类型边界。
- 严禁在业务代码中使用 `console.log`（必须使用统一结构化 logger）。
- 严禁跳过 Validator 将未清洗参数直接传入 Service。
- **严禁仅生成无操作按钮/无弹窗的只读骨架页面**：所有交付管理页必须具备完整 CRUD 按钮、搜索重置栏与新增/编辑弹窗。

## 6. 前端开箱即用交付门禁（Production-Ready Frontend）
1. **工具栏**：必须包含 `+ 新增` 按钮、查询、重置与刷新；
2. **状态与复制**：实体状态必须用色彩分明的 Badge 呈现（如 ACTIVE/DISABLED），关键 Key/Token 必须有快捷复制；
3. **操作列（Actions）**：每行必须具备 `[编辑]`、`[启用/禁用]`、`[删除]` 及业务专有按钮（如探测/测试）；
4. **弹窗表单（Modal Form）**：新增与编辑必须有完备的弹窗组件，带必填校验与友好错误提示。

## 7. 履约与业务流严格隔离规范 (Fulfillment Domain Isolation)
涉及交易、订单、预约与履约逻辑时，必须严格区隔三大履约域：
1. **到店核销域 (`IN_STORE_VERIFICATION`)**：露营、民宿、酒店、体验活动、采摘等，严禁填快递地址或计算物流运费，支付成功后自动签发核销码；
2. **餐饮堂食/外卖域 (`RESTAURANT_DINE_IN`)**：外卖配送与到店自提/堂食；
3. **实物电商配送域 (`PHYSICAL_DELIVERY`)**：农副特产等实物包裹，走地址选择与运费计算。



# Task Breakdown: [FEATURE_TITLE]

> **Spec-Kit 任务拆解与波次依赖清单**
> 必须贯彻 **1 Task = 1 Commit** 铁律，Commit 消息强制带 `[T<ID>]`。
> 所属领域：`[DOMAIN]` | 规格标识：`[SPEC_NAME]`

---

## 任务波次依赖图
```
T1 (契约/数据模型) ──► T2 (业务逻辑与守卫) ──► T3 (真实单测) ──► T4 (门禁验收)
```

## 原子任务清单
- [ ] **[T1] 数据模型与实体定义**
  - **前置依赖**：无
  - **白名单文件**：
    - `packages/plugins/plugin-[DOMAIN]/backend/repositories/`
  - **产物验证**：Prisma / Kysely 迁移生成并通过编译

- [ ] **[T2] Service 核心业务与状态机守卫**
  - **前置依赖**：T1
  - **白名单文件**：
    - `packages/plugins/plugin-[DOMAIN]/backend/services/`
  - **产物验证**：业务状态机流转正确，具备并发防护

- [ ] **[T3] 真实数据库测试与反假 Mock 验证**
  - **前置依赖**：T2
  - **白名单文件**：
    - `packages/plugins/plugin-[DOMAIN]/backend/test/`
  - **产物验证**：`npm run verify:real-db` 100% 通过

- [ ] **[T4] 交付门禁与 Git 历史核验**
  - **前置依赖**：T3
  - **执行命令**：`npm run task:verify -- --feature [SPEC_NAME] --summary`
  - **验收标准**：Gate 1~6 物理门禁全绿

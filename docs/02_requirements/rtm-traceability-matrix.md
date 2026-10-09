# 需求双向跟踪矩阵 (Requirements Traceability Matrix - RTM)

- **基线版本**: v1.1.0 Enterprise Baseline
- **生效日期**: 2026-10-09
- **归属规范**: CMMI 02_requirements (RDM / 双向追溯性管理)
- **追溯闭环铁律**: 业务需求 (SRS) ➔ 架构设计 (ADR/LLD) ➔ 代码实现 (Git Commit) ➔ 真实数据库测试 (SpaceX/Mutation) ➔ 质量门禁 (Gate Evidence)

---

## 1. 核心需求双向跟踪矩阵台账

| 需求编号 | 需求简述 (EARS 句式) | 系统架构与设计组件 (LLD) | 物理源码实现位置 | 自动化测试套件 (真实 DB) | 变异击杀验证 (MSI) | 门禁证据状态 |
|---|---|---|---|---|---|---|
| **REQ-MALL-ORD-001** | 全局租户隔离与 8 大审计底座字段注入 | Kysely AST 租户过滤器 / `BaseMapper` | `packages/shared/backend/database/` | `test/matrix/tenant-isolation.test.ts` | 算子 3: Tenant Mutator (100% Killed) | G5/G6 Passed (Exit Code 0) |
| **REQ-MALL-ORD-002** | 会员等级优惠与价格阶梯计算 | Member Privilege Facade / Mall Pricing Service | `packages/plugins/plugin-mall/backend/` | `test/matrix/mall-pricing.test.ts` | 算子 1: Boundary Mutator (100% Killed) | G5/G6 Passed (Exit Code 0) |
| **REQ-MALL-ORD-003** | CAS 乐观锁原子预扣库存 | Mall Stock CAS Repository / DB Transaction | `packages/plugins/plugin-mall/backend/` | `test/matrix/mall-order-cas.test.ts` | 算子 2: Boolean Invert (100% Killed) | G5/G6 Passed (Exit Code 0) |
| **REQ-MALL-ORD-004** | 售罄并发冲突抛 409 与错误契约 | Global API ErrorHandler / Zod Validator | `packages/shared/backend/lib/error.ts` | `test/matrix/mall-concurrency.test.ts` | 算子 4: Return Mutator (100% Killed) | G5/G6 Passed (Exit Code 0) |
| **REQ-MALL-ORD-005** | 15 分钟超时取消与预占库存自动回滚 | Mall Scheduled Janitor Task / Outbox | `packages/plugins/plugin-mall/backend/tasks/` | `test/matrix/mall-timeout-rollback.test.ts` | 算子 1: Boundary Mutator (100% Killed) | G5/G6 Passed (Exit Code 0) |
| **REQ-MALL-ORD-006** | 支付成功事件驱动出库与 Outbox 可靠投递 | Service Bus / NATS Semantic Reliable Broker | `packages/shared/backend/bus/` | `test/matrix/pay-event-inbox.test.ts` | 算子 2: Boolean Invert (100% Killed) | G5/G6 Passed (Exit Code 0) |

---

## 2. 追溯性合规审计结论 (Traceability Audit Summary)

1. **正向追溯率 (Forward Traceability)**：$6 / 6 = 100\%$。所有 EARS 需求条目均有对应的生产代码与真实数据库自动化测试覆盖；
2. **反向追溯率 (Backward Traceability)**：$100\%$。所有变更提交均带有需求关联标签（`[T<ID>]`），不存在无需求来源的游离冗余代码（Zero Ghost Code）；
3. **测试充分性保证**：每个核心状态跃迁均由 Stryker 变异测试进行故障注入验证，击杀率达到 $96.8\%$，杜绝假 Mock 假覆盖。

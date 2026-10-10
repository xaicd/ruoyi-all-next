# Quality Checklist & Acceptance Gate: [FEATURE_TITLE]

> **Spec-Kit 质量验收与门禁自检清单**
> 所属领域：`[DOMAIN]` | 规格标识：`[SPEC_NAME]`

---

## 门禁自检项 (Quality Checkpoints)
- [ ] **1. 宪法一致性 (Constitution Alignment)**：无新增手写重复 CRUD，继承 BaseMapper 与 8 大审计字段。
- [ ] **2. 真实数据库驱动 (Zero Fake Mock)**：测试 100% 由 PostgreSQL / SQLite 驱动，无内存临时假数据。
- [ ] **3. 跨域调用合规**：跨域通信 100% 走 Domain Facade，无越权直接 import。
- [ ] **4. 权限与租户隔离**：所有 API 均配置权限码，全局行级租户隔离自动注入。
- [ ] **5. 任务可追溯性**：Git 提交记录全部带有 `[T<ID>]` 标识且在文件白名单内。
- [ ] **6. 自动化回归测试**：`npm run check` 21 项静态门禁退出码为 0。
- [ ] **7. 生产回滚演练**：Runbook 包含明确的失败回滚步骤。

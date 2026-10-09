# CMMI 百科：01~09 全生命周期工程规范与 7 类物理交付资产

> 对应标准：CMMI V2.0 / V3.0 (DEV + SVC 模型) / docs/architecture/CMMI-PROCESS-ASSETS-AND-DELIVERY-STANDARD.md

## 一、 全生命周期九大阶段与工程基准工作产品

1. **01_management (立项与决策)**：
   - 决策分析与权衡记录：`docs/01_management/dar/DAR-20261009-MESSAGE-BUS-PROTOCOL.md` (dar-decision-matrix 技能)
   - 项目立项与范围说明书：`docs/01_management/project-charter.md`
   - 风险登记册与缓解预案：`docs/01_management/risk-register.md`
2. **02_requirements (需求工程)**：
   - IEEE 29148 / EARS 需求规格：`docs/02_requirements/srs/SRS-EARS-MALL-ORDER-CAS.md` (ears-spec-writer 技能)
   - 需求双向跟踪矩阵：`docs/02_requirements/rtm-traceability-matrix.md`
3. **03_design (系统与架构设计)**：
   - 架构决策记录：`docs/03_design/adr/ADR-0001-MULTI-TENANT-KYSELY-AST.md`、`ADR-0002-FIRST-PARTY-PLUGIN-ISOLATION.md` (adr-architect 技能)
   - 交互式架构图谱：`docs/03_design/diagrams/ruoyi-architecture.arch.json` / `.arch.html` (archify 技能)
   - 数据库底座与8大审计字段：`docs/03_design/database-design-erd.md`
4. **04_features / 04_implementation (构造与编码)**：
   - 第一方业务插件隔离：`packages/plugins/plugin-*/` (15 个业务域)
   - 泛型 BaseMapper/QueryWrapper 引擎：`packages/shared/backend/database/`
   - 极简 Brief 声明驱动：`docs/specs/<domain>/<name>/brief.json` 与 1 Task = 1 Commit
5. **05_verification (验证与打假)**：
   - 变异测试打假报告：`docs/05_verification/mutation/MUTATION-TESTING-REPORT-INVENTORY-CAS.md` (mutation-tester 技能, MSI 96.8%)
   - SpaceX 级真实数据库测试报告：`docs/05_verification/test-summary-report.md` (416/416 全绿)
6. **06_quality_assurance (质量与配置审计)**：
   - 功能与物理配置审计：`docs/06_quality_assurance/audit/PCA-FCA-COMPLIANCE-AUDIT-v1.1.0.md` (compliance-auditor 技能)
   - 20 道门禁数字凭证：`docs/06_quality_assurance/gate-evidence-trace.json`
7. **07_release (发布与网关)**：
   - 版本发布说明书：`docs/07_release/RELEASE_NOTES_v1.1.0.md`
   - 生产安装部署 SOP：`docs/07_release/system-deployment-sop.md`
   - 故障秒级回滚预案：`docs/07_release/rollback-runbook.json`
8. **08_sre (站点可靠性与安全)**：
   - 服务等级目标与错误预算：`docs/08_sre/slo/SLO-SLI-ERROR-BUDGET-MATRIX.md` (sre-slo-manager 技能)
   - 事故免责复盘报告：`docs/08_sre/postmortem/POSTMORTEM-20261009-INVENTORY-RACE-CONDITION.md` (postmortem-analyzer 技能)
   - Strix 60k★ 自主红队渗透报告：`docs/08_sre/security-reports/STRIX-PENTEST-POC-AUDIT.md` (strix-penetration-testing 技能)
9. **09_operations (持续运营与平账)**：
   - 全链路日终平账报告：`docs/09_operations/reconciliation/DAILY-RECONCILIATION-REPORT-20261009.md` (financial-reconciliation-agent 技能)
   - 系统全域健康巡检报告：`docs/09_operations/inspection/SYSTEM-HEALTH-INSPECTION-20261009.md`

## 二、 交付哲学：No Artifact, No Done
严禁口头声明完工，每个工单与版本必须落地 7 类物理工程资产之一，并附带退出码为 0 的可核验凭证。

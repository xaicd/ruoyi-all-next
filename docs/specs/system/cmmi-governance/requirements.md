# 需求：CMMI 全生命周期交付治理与 8 大工程技能体系

状态：`PLAN_APPROVED`　类型：`enhancement`　特性：`cmmi-governance`　域名：`system`

## 1. 目标

在底座中建立 CMMI 01_management 至 09_operations 全生命周期交付规范，集成 8 大 CMMI 原生技能，落地真实工程交付资产，确立实事求是与无真实数据留空铁律。


## 2. 角色

| 角色 | 能力 |
|---|---|
| 系统架构师 / 研发工程师 | 遵循 MADR 规范记录架构决策，依托 Kysely AST 租户过滤器与泛型 BaseMapper 展开业务逻辑 |
| 质量与合规审计员 (PPQA) | 执行 20 道自动化门禁审计（Exit Code 0）、真实数据库测试验证与 FCA/PCA 配置基线签发 |

## 3. 用户故事（按优先级）

1. **P0** 在 .agents/skills/ 沉淀 8 大 CMMI 原生技能，并通过 npm run skills:check 实行单一真源强制校验。
2. **P0** 在 docs/01_management 至 09_operations 建立两级过程资产库，落地立项书、风险册、真实 ADR、测试总结与门禁凭证。
3. **P1** 确立『真实证据驱动、零假 Demo』交付铁律，未发生生产故障与无真实运营流水的目录保持严格留空。

## 4. 约束

* 单一真源：技能唯一真源为 .agents/skills/<name>/SKILL.md，严禁建立重复副本。
* 零假 Demo：严禁伪造虚假事故复盘与虚假财务流水，无真实数据保持留空。
* No Artifact, No Done：每个工单必须产出真实物理工程资产之一，并附带退出码为 0 的可核验凭证。

## 5. 验收标准

1. `npm run check` exit=0，20 道门禁全部通过
2. `npm run skills:check` 验证 36 项技能规范且无重复目录
3. `npm run test:matrix` 真实数据库测试 100% 通过（55 passed / 6 skipped）

## 6. 不做什么

* 不在底座模板中硬编码虚构的业务生产故障事故或虚假的线上对账流水

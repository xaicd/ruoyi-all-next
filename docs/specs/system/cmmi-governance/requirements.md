# Requirements: CMMI 全生命周期交付治理与 8 大工程技能体系

状态：`PLAN_APPROVED`　类型：`enhancement`　特性：`cmmi-governance`　域名：`system`
上游：一句话立项需求。任何范围调整必须先改本文件（§6.1）。

## 1. 目标与背景 (Introduction)

在底座中建立 CMMI 01_management 至 09_operations 全生命周期交付规范，集成 8 大 CMMI 原生技能，落地真实工程交付资产，确立实事求是与无真实数据留空铁律。



### 性能基线与优化目标 (Baseline vs Target Metrics)

- 当前基线 (Baseline): 未明确
- 目标指标 (Target): 未明确



## 2. 术语表 (Glossary)

| 术语 | 英文 | 定义 |
|---|---|---|
| CMMI 全生命周期交付治理与 8 大工程技能体系 | cmmi-governance | 本规格所交付的业务与技术上下文 |

## 3. 用户故事 (User Stories)

### US-001: 作为系统架构师 / 研发工程师
- **优先级**: `P0`
- **内容**: 在 .agents/skills/ 沉淀 8 大 CMMI 原生技能，并通过 npm run skills:check 实行单一真源强制校验。

### US-002: 作为系统架构师 / 研发工程师
- **优先级**: `P0`
- **内容**: 在 docs/01_management 至 09_operations 建立两级过程资产库，落地立项书、风险册、真实 ADR、测试总结与门禁凭证。

### US-003: 作为系统架构师 / 研发工程师
- **优先级**: `P1`
- **内容**: 确立『真实证据驱动、零假 Demo』交付铁律，未发生生产故障与无真实运营流水的目录保持严格留空。


## 4. 关键业务不变量 (Invariants)

1. **No Artifact, No Done** —— 每个阶段必须交付真实物理工程资产，严禁口头声明完工
2. **实事求是留空准则** —— 无真实生产事故与流水账单的目录保持严格留空，杜绝伪造假 Demo 糊弄

## 5. 验收标准 (Acceptance Criteria)

1. **THE system SHALL** 验证：`npm run check` exit=0，20 道门禁全部通过
2. **THE system SHALL** 验证：`npm run skills:check` 验证 36 项技能规范且无重复目录
3. **THE system SHALL** 验证：`npm run test:matrix` 真实数据库测试 100% 通过（55 passed / 6 skipped）

## 6. 约束与边界 (Constraints & Non-Goals)

* **THE system SHALL COMPLY WITH**: 单一真源：技能唯一真源为 .agents/skills/<name>/SKILL.md，严禁建立重复副本。
* **THE system SHALL COMPLY WITH**: 零假 Demo：严禁伪造虚假事故复盘与虚假财务流水，无真实数据保持留空。
* **THE system SHALL COMPLY WITH**: No Artifact, No Done：每个工单必须产出真实物理工程资产之一，并附带退出码为 0 的可核验凭证。

### 明确不做 (Non-Goals)
* 不在底座模板中硬编码虚构的业务生产故障事故或虚假的线上对账流水

# Requirements: CMMI 全生命周期交付治理与 8 大工程技能体系

状态：`PLAN_APPROVED`　类型：`enhancement`　特性：`cmmi-governance`　域名：`system`

## 1. 目标与背景 (Introduction)

在底座中建立 CMMI 01_management 至 09_operations 全生命周期交付规范，集成 8 大 CMMI 原生技能，落地真实工程交付资产，确立实事求是与无真实数据留空铁律。


## 2. 术语表 (Glossary)

| 术语 | 定义说明 |
|---|---|
| **CMMI 全生命周期交付治理与 8 大工程技能体系** | 当前特性的核心业务领域与交付边界 |
| **Tenant Scope** | 租户隔离上下文，操作严格携带并过滤 tenant_id |
| **Domain Facade** | 跨域调用的唯一权威门面通道，严禁直接 import 外部 Service |
| **Base Audit Columns** | 8 大核心审计列：id, tenant_id, created_by, created_at, updated_by, updated_at, deleted_at, version |

## 3. 角色矩阵 (Actors)

| 角色 | 核心能力与职责 |
|---|---|
| 系统架构师 / 研发工程师 | 遵循 MADR 规范记录架构决策，依托 Kysely AST 租户过滤器与泛型 BaseMapper 展开业务逻辑 |
| 质量与合规审计员 (PPQA) | 执行 20 道自动化门禁审计（Exit Code 0）、真实数据库测试验证与 FCA/PCA 配置基线签发 |

## 4. 用户故事与需求定义 (User Stories & Requirements)

### Requirement 1: 在 .agents/skills/ 沉淀 8 大 CMMI 原生技能，并通过 npm run skills:check 实行单一真源强制校验。
**User Story:** 作为 系统架构师 / 研发工程师，我希望 在 .agents/skills/ 沉淀 8 大 CMMI 原生技能，并通过 npm run skills:check 实行单一真源强制校验。，以便于达成业务目标。

#### 优先级: `P0`

#### 验收标准 (EARS 规范 Acceptance Criteria)
1. **THE system SHALL** 确保操作在已验签的租户上下文内执行，严禁跨租户越权。
2. **WHEN** 触发该业务操作 **THEN** 系统必须验证参数有效性并记录结构化审计日志。
3. **IF** 参数非法或校验失败 **THEN** 系统必须拒绝并返回 400 统一错误契约。

### Requirement 2: 在 docs/01_management 至 09_operations 建立两级过程资产库，落地立项书、风险册、真实 ADR、测试总结与门禁凭证。
**User Story:** 作为 质量与合规审计员 (PPQA)，我希望 在 docs/01_management 至 09_operations 建立两级过程资产库，落地立项书、风险册、真实 ADR、测试总结与门禁凭证。，以便于达成业务目标。

#### 优先级: `P0`

#### 验收标准 (EARS 规范 Acceptance Criteria)
1. **THE system SHALL** 确保操作在已验签的租户上下文内执行，严禁跨租户越权。
2. **WHEN** 触发该业务操作 **THEN** 系统必须验证参数有效性并记录结构化审计日志。
3. **IF** 参数非法或校验失败 **THEN** 系统必须拒绝并返回 400 统一错误契约。

### Requirement 3: 确立『真实证据驱动、零假 Demo』交付铁律，未发生生产故障与无真实运营流水的目录保持严格留空。
**User Story:** 作为 系统架构师 / 研发工程师，我希望 确立『真实证据驱动、零假 Demo』交付铁律，未发生生产故障与无真实运营流水的目录保持严格留空。，以便于达成业务目标。

#### 优先级: `P1`

#### 验收标准 (EARS 规范 Acceptance Criteria)
1. **THE system SHALL** 确保操作在已验签的租户上下文内执行，严禁跨租户越权。
2. **WHEN** 触发该业务操作 **THEN** 系统必须验证参数有效性并记录结构化审计日志。
3. **IF** 参数非法或校验失败 **THEN** 系统必须拒绝并返回 400 统一错误契约。


## 5. 核心验收准则 (Acceptance Criteria)

1. **THE system SHALL** 验证：`npm run check` exit=0，20 道门禁全部通过
2. **THE system SHALL** 验证：`npm run skills:check` 验证 36 项技能规范且无重复目录
3. **THE system SHALL** 验证：`npm run test:matrix` 真实数据库测试 100% 通过（55 passed / 6 skipped）

## 6. 约束与边界 (Constraints & Non-Goals)

### 约束条件
* **THE system SHALL COMPLY WITH**: 单一真源：技能唯一真源为 .agents/skills/<name>/SKILL.md，严禁建立重复副本。
* **THE system SHALL COMPLY WITH**: 零假 Demo：严禁伪造虚假事故复盘与虚假财务流水，无真实数据保持留空。
* **THE system SHALL COMPLY WITH**: No Artifact, No Done：每个工单必须产出真实物理工程资产之一，并附带退出码为 0 的可核验凭证。

### 不包含范围 (Non-Goals)
* 不在底座模板中硬编码虚构的业务生产故障事故或虚假的线上对账流水

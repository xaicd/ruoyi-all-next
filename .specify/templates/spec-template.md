# Requirements Specification: {{TITLE}}

> **Spec-Kit 标准需求规格说明书 (SRS: Software Requirements Specification)**
> 遵循 IEEE 29148 与 EARS (Easy Approach to Requirements Syntax) 严谨需求工程标准。
> 状态：`PLAN_APPROVED` | 规格类型：`{{TYPE}}` | 所属领域：`{{DOMAIN}}` | 规格标识：`{{NAME}}`
> 对应项目宪法：`.specify/memory/constitution.md` (Rule 0 ~ 13 项不可动摇工程铁律)

---

## 1. 业务目标与愿景 (Introduction & Business Goal)

{{GOAL}}

{{SUBTYPE_SECTION}}

## 2. 术语定义与领域边界 (Glossary & Domain Scope)

| 术语 / 概念 | 英文标识 | 领域定义与所属模块 |
|---|---|---|
| {{TITLE}} | {{NAME}} | 本规格所交付的业务与技术上下文，严格收敛于 `{{DOMAIN}}` 领域边界 |
| 行级租户隔离 | Multi-Tenant AST | 基于 Kysely AST 自动在 SQL 注入 `tenant_id` 过滤条件，严禁跨租户越权 |
| 审计底座字段 | Audit Base Columns | 实体必须自动继承 8 大审计字段，严禁业务层手工更新审计元数据 |

## 3. 用户故事与角色矩阵 (User Stories & Personas)

{{USER_STORIES}}

## 4. 关键业务不变量 (Key Business Invariants)

{{INVARIANTS}}

## 5. 验收标准清单 (Acceptance Criteria)

{{ACCEPTANCE_CRITERIA}}

## 6. 约束条件与技术边界 (Constraints & Non-Goals)

### 系统必须满足的架构约束 (The System SHALL Comply With)
{{CONSTRAINTS}}

### 明确不做与负向范围 (Non-Goals)
{{NON_GOALS}}

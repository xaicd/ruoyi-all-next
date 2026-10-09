#!/usr/bin/env node
/**
 * 由 **brief.json** 展开出特性全部文档（AGENTS §19: 声明式驱动，禁止逐行手写样板）。
 *
 * 为什么这么做: 让模型写 7 份文档 = 每次几百上千 token、还会漏小节、格式还会漂。
 * 让模型写**一份 brief**（<500 token），由这个引擎展开 —— 结构不可能缺、
 * 格式永远一致、token 消耗降一个数量级。这和 codegen 是同一个思路。
 *
 * 用法:
 *   node scripts/build-feature.cjs --name ecommerce           # 展开
 *   node scripts/build-feature.cjs --name ecommerce --check   # 只校验 brief 是否够写文档
 */
const fs = require("node:fs")
const path = require("node:path")

const ROOT = path.resolve(__dirname, "..")
const arg = (flag) => {
  const index = process.argv.indexOf(flag)
  return index >= 0 ? process.argv[index + 1] : undefined
}
const name = arg("--name")
if (!name) {
  console.error("用法: node scripts/build-feature.cjs --name <特性名> [--check]")
  process.exit(2)
}

const { resolveSpecDir } = require("./lib/spec-resolver.cjs")

const dir = resolveSpecDir(name)
if (!dir) {
  console.error(`[spec] 找不到规格 ${name} —— 先写 brief（npm run spec:new 会给骨架）`)
  process.exit(2)
}
const briefPath = path.join(dir, "brief.json")
if (!fs.existsSync(briefPath)) {
  console.error(`[spec] 找不到 ${path.relative(ROOT, briefPath)} —— 先写 brief（npm run spec:new 会给骨架）`)
  process.exit(2)
}

let brief
try {
  brief = JSON.parse(fs.readFileSync(briefPath, "utf8"))
} catch (error) {
  console.error(`[feature] brief.json 不是合法 JSON —— ${error.message}`)
  process.exit(2)
}

// ---- brief 完备性: 缺什么就直接说缺什么，而不是展开出一份空文档 ----
const missing = []
if (!brief.title) missing.push("title")
if (!brief.domain) missing.push("domain")
if (!brief.goal) missing.push("goal")
if ((brief.roles ?? []).length < 2) missing.push("roles（至少 2 个角色）")
if ((brief.stories ?? []).length < 3) missing.push("stories（至少 3 条用户故事）")
if ((brief.acceptance ?? []).length < 2) missing.push("acceptance（至少 2 条可执行验收）")
if ((brief.invariants ?? []).length < 1) missing.push("invariants（至少 1 条关键不变量）")
if ((brief.tasks ?? []).length < 3) missing.push("tasks（至少 3 条任务）")
if (missing.length > 0) {
  console.error(`[feature] brief 不完整，缺: ${missing.join("、")}`)
  process.exit(2)
}
if (process.argv.includes("--check")) {
  console.log(`[feature] brief 完整（${brief.stories.length} 故事 / ${brief.acceptance.length} 验收 / ${brief.tasks.length} 任务）`)
  process.exit(0)
}

const files = {}

files["requirements.md"] = `# Requirements: ${brief.title}

状态：\`PLAN_APPROVED\`　类型：\`${brief.type ?? "feature"}\`　特性：\`${name}\`　域名：\`${brief.domain}\`

## 1. 目标与背景 (Introduction)

${brief.goal}
${brief.type === "bugfix" ? `\n### 缺陷现象 (Symptom)\n\n${brief.symptom ?? "<!-- 待填 -->"}\n\n### 根因分析 (Root Cause)\n\n${brief.rootCause ?? "<!-- 待填 -->"}\n\n### 保持既有行为 (Preserved Behavior)\n\n${brief.preservedBehavior ?? "已有正常业务功能与数据保持严格兼容。"}\n` : ""}
${brief.type === "refactor" ? `\n### 架构债务与异味分析 (Debt Analysis)\n\n${brief.debtAnalysis ?? "<!-- 待填 -->"}\n\n### 目标整洁架构形态 (Target Architecture)\n\n${brief.targetArchitecture ?? "<!-- 待填 -->"}\n` : ""}
${brief.type === "enhancement" ? `\n### 性能基线与优化目标 (Baseline vs Target Metrics)\n\n- 当前基线 (Baseline): ${brief.baselineMetric ?? "未明确"}\n- 目标指标 (Target): ${brief.targetMetric ?? "未明确"}\n` : ""}
${brief.type === "security" ? `\n### 漏洞评级与威胁攻击面 (Vulnerability Advisory & Attack Surface)\n\n- 漏洞概述与 PoC: ${brief.vulnerabilityAdvisory ?? "<!-- 待填 -->"}\n- 攻击面削减: ${brief.attackSurface ?? "<!-- 待填 -->"}\n` : ""}

## 2. 术语表 (Glossary)

| 术语 | 定义说明 |
|---|---|
| **${brief.title}** | 当前特性的核心业务领域与交付边界 |
| **Tenant Scope** | 租户隔离上下文，操作严格携带并过滤 tenant_id |
| **Domain Facade** | 跨域调用的唯一权威门面通道，严禁直接 import 外部 Service |
| **Base Audit Columns** | 8 大核心审计列：id, tenant_id, created_by, created_at, updated_by, updated_at, deleted_at, version |

## 3. 角色矩阵 (Actors)

| 角色 | 核心能力与职责 |
|---|---|
${(brief.roles ?? []).map((item) => `| ${item.role} | ${item.can} |`).join("\n")}

## 4. 用户故事与需求定义 (User Stories & Requirements)

${(brief.stories ?? []).map((item, index) => `### Requirement ${index + 1}: ${item.text}
**User Story:** 作为 ${(brief.roles?.[index % (brief.roles?.length || 1)]?.role || "操作员")}，我希望 ${item.text}，以便于达成业务目标。

#### 优先级: \`${item.priority}\`

#### 验收标准 (EARS 规范 Acceptance Criteria)
1. **THE system SHALL** 确保操作在已验签的租户上下文内执行，严禁跨租户越权。
2. **WHEN** 触发该业务操作 **THEN** 系统必须验证参数有效性并记录结构化审计日志。
3. **IF** 参数非法或校验失败 **THEN** 系统必须拒绝并返回 400 统一错误契约。
`).join("\n")}

## 5. 核心验收准则 (Acceptance Criteria)

${(brief.acceptance ?? []).map((item, index) => `${index + 1}. **THE system SHALL** 验证：${item.check}`).join("\n")}

## 6. 约束与边界 (Constraints & Non-Goals)

### 约束条件
${(brief.constraints ?? []).map((item) => `* **THE system SHALL COMPLY WITH**: ${item}`).join("\n")}

### 不包含范围 (Non-Goals)
${(brief.nonGoals ?? []).map((item) => `* ${item}`).join("\n")}
`

// 若为 bugfix 类型，额外输出 Kiro 原生标准的 bugfix.md 规格文档
if (brief.type === "bugfix") {
  files["bugfix.md"] = `# Bugfix: ${brief.title}

状态：\`PLAN_APPROVED\`　类型：\`bugfix\`　特性：\`${name}\`　域名：\`${brief.domain}\`

## 1. 缺陷概述 (Defect Overview)

${brief.goal}

## 2. 缺陷表现与复现步骤 (Symptom & Reproduction)

${brief.symptom ?? "<!-- 待填 -->"}

## 3. 根因分析 (Root Cause Analysis - 5-Whys)

${brief.rootCause ?? "<!-- 待填 -->"}

## 4. 必须保持的既有正常行为 (Preserved Behavior & Anti-Regression)

${brief.preservedBehavior ?? "所有未受缺陷影响的已有核心业务流转、对外 API 契约与历史数据结构必须保持 100% 行为不变。"}

## 5. 红绿修复与验收准则 (Red-to-Green Test Criteria)

${(brief.acceptance ?? []).map((item, index) => `${index + 1}. **THE system SHALL** 验证：${item.check}`).join("\n")}

## 6. 修补方案设计与防御不变量 (Patch Design & Invariants)

${(brief.invariants ?? []).map((item, index) => `${index + 1}. **${item.name}** —— ${item.how}`).join("\n")}

## 7. 约束与补丁边界 (Constraints & Non-Goals)

${(brief.constraints ?? []).map((item) => `* **THE system SHALL COMPLY WITH**: ${item}`).join("\n")}
`
}

files["design.md"] = `# Design: ${brief.title}

上游：\`requirements.md\`（本设计严格支撑需求，不得反向修改需求定义）

## 1. 架构总览与组件边界 (Architecture & Component Boundaries)

\`\`\`mermaid
flowchart TD
  subgraph Client["多端接入层"]
    UI["Web 运营后台 / 移动端"]
  end
  subgraph BFF["BFF 网关与鉴权层"]
    Route["Route Handler (/api/v1/${brief.domain}/**)"]
    Validator["Zod Validator"]
  end
  subgraph Domain["领域服务核心 (Domain Core)"]
    Service["${brief.domain} Domain Service"]
    Facade["Domain Facade (公开跨域接口)"]
  end
  subgraph Storage["持久化与底座引擎"]
    DB[("PostgreSQL / SQLite WAL")]
  end
  UI --> Route --> Validator --> Service --> DB
  Facade -.-> Service
\`\`\`

${brief.architecture ?? "（遵循 Hexagonal 架构：Route -> Validator -> Service -> Repository -> Kysely/Prisma）"}

## 2. 数据模型 (Data Models)

| 表名 | 说明 | 租户隔离策略 | 审计底座 |
|---|---|---|---|
${(brief.entities ?? []).map((item) => `| \`${item.table}\` | ${item.note ?? "业务持久化实体"} | Strict tenant_id | 8 大审计列在位 |`).join("\n")}

> **表定义真源**：低代码元数据与 Prisma Migrations（AGENTS §9.5），不手写破坏性 DDL。

## 3. 关键不变量与状态机守卫 (Invariants & State Guards)

${(brief.invariants ?? []).map((item, index) => `${index + 1}. **${item.name}** —— ${item.how}`).join("\n")}

## 4. 接口契约与错误语义 (API Contracts & Error Semantics)

- **成功响应**：统一返回 \`{ success: true, data: T }\`
- **400 Bad Request**：参数缺失或 Zod Schema 校验不通过
- **401 Unauthorized**：未认证或 Token 过期失效
- **403 Forbidden**：缺乏对应权限码 (Permission Code)
- **409 Conflict**：并发乐观锁版本冲突 (\`version\` 漂移)

## 5. UI 与交互要点 (UI & Interactions)

${(brief.ui ?? []).map((item) => `* ${item}`).join("\n")}

## 6. SRE 与运维保障 (SRE & Operations)

${(brief.ops ?? []).map((item) => `* ${item}`).join("\n")}

## 7. 风险评估与缓解对策 (Risks & Mitigations)

| 风险描述 | 严重等级 | 缓解机制与应急预案 |
|---|---|---|
${(brief.risks ?? []).map((item) => `| ${item.risk} | 高 | ${item.mitigation} |`).join("\n")}
`

files["prototype.md"] = `# 原型：${brief.title}

上游：\`design.md\`。支持文本线框、视觉切图 (./assets/) 与可交互 HTML 原型 (./prototypes/)。

## 1. 页面线框与文本模型

${(brief.screens ?? []).map((item) => `### ${item.name}\n\n\`\`\`\n${item.wireframe}\n\`\`\`\n`).join("\n")}

## 2. 视觉原型与设计图 (PNG / SVG)

> 提示：将设计切图、Figma 导图、线框截图放入同级 \`assets/\` 并在下方引用。

<!-- 示例: ![主页面原型](./assets/wireframe-main.png) -->
（若有设计稿截图，请放置于 ./assets/ 目录并在此关联）

## 3. 可交互 HTML 原型 (Interactive Prototype)

> 提示：单文件 HTML 或 Axure 导出包放置于同级 \`prototypes/\` 目录。

<!-- 示例: 本地交互原型文件: [点击预览 HTML 原型](./prototypes/index.html) -->
（若有 HTML 原型，请放置于 ./prototypes/ 目录）

## 4. 交互要点与防呆设计

${(brief.interactions ?? []).map((item) => `* ${item}`).join("\n")}

## 5. 状态与四态规范 (4-States)

${(brief.states ?? []).map((item) => `* ${item}`).join("\n")}
`

files["tasks.md"] = `# Tasks: ${brief.title}

上游：\`design.md\`。规格变化必须退回规划阶段（§6.1）。

## 1. 任务依赖波次图 (Task Dependency Graph - Kiro Waves)

\`\`\`json
{
  "waves": [
    { "id": "wave-1", "title": "地基与契约准备", "tasks": ["T1"], "dependsOn": [] },
    { "id": "wave-2", "title": "核心服务与数据流落地", "tasks": ["T2"], "dependsOn": ["wave-1"] },
    { "id": "wave-3", "title": "端到端测试与集成验证", "tasks": ["T3"], "dependsOn": ["wave-2"] }
  ]
}
\`\`\`

## 2. 交互式任务清单 (Interactive Execution Tasks)

${(brief.tasks ?? []).map((item) => `- [ ] **${item.id}**: ${item.title}
  - 归属: \`${item.parent}\`
  - 文件白名单: \`${(item.files ?? ["-"]).join(", ")}\`
  - 验收要求: 必须携带提交标识 \`[${item.id}]\` 并附带真实测试验证
`).join("\n")}

## 3. CMMI 双向追溯与 Git 提交核实矩阵 (RTM & Git Trace)

> **两条硬规矩**（对齐 CMMI「主线-支线任务树」与「1 Task = 1 Commit」）:
> 1. **归属**必须写 \`main\`（主线）或某个已存在的任务 ID —— **不允许孤儿任务**
> 2. **文件白名单**必填（逗号分隔）；\`-\` 表示该任务不改文件（纯验证类）
>
> 完成度**不看"状态"列**，而是从 git 推导: commit message 带 \`[T<ID>]\`（方括号，避免误匹配）
> 且改动文件落在白名单内，才算这条任务真的做了（\`npm run task:verify\`）。

| ID | 归属 | 任务 | 文件白名单 | 状态 |
|---|---|---|---|---|
${(brief.tasks ?? []).map((item) => `| ${item.id} | ${item.parent} | ${item.title} | ${(item.files ?? ["-"]).join(", ")} | 未开始 |`).join("\n")}

## 4. 依赖说明

${brief.dependencies ?? "无外部阻断性依赖"}

## 5. 阶段状态

* 规划：\`PLAN_APPROVED\`（由 brief 展开）
* 开发：待开始
* 独立测试：待开始
`

files["selection.md"] = `# 选型与研判（G0 · DAR）：${brief.title}

## 1. 候选方案

| 候选 | 类型 | 许可证 | 许可风险 |
|---|---|---|---|
${(brief.candidates ?? []).map((item) => `| ${item.name} | ${item.type} | ${item.license} | ${item.risk} |`).join("\n")}

## 2. 竞品对标

${(brief.benchmarks ?? []).map((item) => `* ${item}`).join("\n")}

## 3. 开源生态扫描

${(brief.scan ?? []).map((item) => `* ${item}`).join("\n")}

## 4. License 合规结论

**结论: ${brief.licenseConclusion ?? "（未填 —— 这一项必须有明确结论）"}**
`

files["bugs.md"] = `# 缺陷：${brief.title}

> 每条缺陷必须带**复现命令**与**验证命令**。没有复现步骤的描述**无法被独立验证**。
> 状态取值: \`未修\` / \`已修\` / \`不修\`。空表是合法的（当前无缺陷）。

| ID | 现象 | 复现命令 | 验证命令 | 状态 |
|---|---|---|---|---|
`

// 实施轨的可执行 runbook —— 由 brief 的 deployment 段展开；缺省给标准四步骨架。
files["runbook.json"] = JSON.stringify(
  {
    feature: name,
    note: "实施轨的可执行割接方案。不可逆步骤**必须**有 rollback，否则 --check 会拦下。",
    window: { minutes: brief.windowMinutes ?? 10 },
    steps: (brief.cutover ?? [
      { id: "S1", name: "预检: 环境指纹一致（测试过的 == 要上线的）", command: "npm run fingerprint:verify", timeoutMs: 60000 },
      { id: "S2", name: "停写（置只读）", command: "echo '置只读 —— 换成真实的只读开关命令'", timeoutMs: 60000 },
      { id: "S3", name: "执行迁移", command: "npx prisma migrate deploy", timeoutMs: 300000, irreversible: true },
      { id: "S4", name: "健康检查: 插件接口可达", command: `node scripts/agent/run-ops.cjs ${brief.domain}.${(brief.entities?.[0]?.table ?? "root")} health`, timeoutMs: 60000 },
      { id: "S5", name: "业务冒烟: 关键路径", command: "npm run test:agent -- --grep @smoke", timeoutMs: 300000 },
    ]),
    rollback: brief.rollback ?? [
      { id: "R1", name: "回退到上一指纹版本", command: "echo '换成真实的回退命令（如切换镜像 tag）'", timeoutMs: 120000 },
      { id: "R2", name: "健康检查通过", command: "npm run fingerprint:verify", timeoutMs: 60000 },
      { id: "R3", name: "核实数据未被破坏", command: "npm run verify:real-db -- --reuse", timeoutMs: 600000 },
    ],
  },
  null,
  2,
) + "\n"

if (process.argv.includes("--dry-run")) {
  console.log(`[spec] dry-run: 将展开 ${Object.keys(files).length} 份文档 -> ${path.relative(ROOT, dir)}/`)
  process.exit(0)
}

for (const [file, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, file), content)
}
console.log(`[spec] 已由 brief 展开 ${Object.keys(files).length} 份文档 -> ${path.relative(ROOT, dir)}/`)
console.log(`[spec] 校验: node scripts/check-delivery.cjs --feature ${name}`)

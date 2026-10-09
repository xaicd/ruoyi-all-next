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

const briefPath = path.join(ROOT, "docs", "features", name, "brief.json")
if (!fs.existsSync(briefPath)) {
  console.error(`[feature] 找不到 ${path.relative(ROOT, briefPath)} —— 先写 brief（npm run feature:new 会给骨架）`)
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

const dir = path.join(ROOT, "docs", "features", name)
const files = {}

files["requirements.md"] = `# 需求：${brief.title}

状态：\`PLAN_APPROVED\`　类型：\`${brief.type ?? "feature"}\`　特性：\`${name}\`　域名：\`${brief.domain}\`

## 1. 目标

${brief.goal}
${brief.type === "bugfix" ? `\n## 缺陷现象 (Symptom)\n\n${brief.symptom ?? "<!-- 待填 -->"}\n\n## 根因分析 (Root Cause)\n\n${brief.rootCause ?? "<!-- 待填 -->"}\n` : ""}

## 2. 角色

| 角色 | 能力 |
|---|---|
${(brief.roles ?? []).map((item) => `| ${item.role} | ${item.can} |`).join("\n")}

## 3. 用户故事（按优先级）

${(brief.stories ?? []).map((item, index) => `${index + 1}. **${item.priority}** ${item.text}`).join("\n")}

## 4. 约束

${(brief.constraints ?? []).map((item) => `* ${item}`).join("\n")}

## 5. 验收标准

${(brief.acceptance ?? []).map((item, index) => `${index + 1}. ${item.check}`).join("\n")}

## 6. 不做什么

${(brief.nonGoals ?? []).map((item) => `* ${item}`).join("\n")}
`

files["design.md"] = `# 设计：${brief.title}

上游：\`docs/features/${name}/requirements.md\`（本文件不得反向修改需求）

## 1. 架构

${brief.architecture ?? "（由 brief 未提供，需补）"}

## 2. 数据

| 表 | 说明 |
|---|---|
${(brief.entities ?? []).map((item) => `| \`${item.table}\` | ${item.note ?? ""} |`).join("\n")}

表定义真源 = 低代码元数据（AGENTS §9.5），不手写 DDL。

## 3. 关键不变量

${(brief.invariants ?? []).map((item, index) => `${index + 1}. **${item.name}** —— ${item.how}`).join("\n")}

## 4. UI

${(brief.ui ?? []).map((item) => `* ${item}`).join("\n")}

## 5. 运维与运营

${(brief.ops ?? []).map((item) => `* ${item}`).join("\n")}

## 6. 风险

| 风险 | 处理 |
|---|---|
${(brief.risks ?? []).map((item) => `| ${item.risk} | ${item.mitigation} |`).join("\n")}
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

files["tasks.md"] = `# 任务：${brief.title}

上游：\`design.md\`。规格变化必须退回规划阶段（§6.1）。

> **两条硬规矩**（对齐 CMMI「主线-支线任务树」与「1 Task = 1 Commit」）:
> 1. **归属**必须写 \`main\`（主线）或某个已存在的任务 ID —— **不允许孤儿任务**
> 2. **文件白名单**必填（逗号分隔）；\`-\` 表示该任务不改文件（纯验证类）
>
> 完成度**不看"状态"列**，而是从 git 推导: commit message 带 \`[T<ID>]\`（方括号，避免误匹配）
> 且改动文件落在白名单内，才算这条任务真的做了（\`npm run task:verify\`）。

| ID | 归属 | 任务 | 文件白名单 | 状态 |
|---|---|---|---|---|
${(brief.tasks ?? []).map((item) => `| ${item.id} | ${item.parent} | ${item.title} | ${(item.files ?? ["-"]).join(", ")} | 未开始 |`).join("\n")}

## 依赖

${brief.dependencies ?? ""}

## 阶段状态

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
  console.log(`[feature] dry-run: 将展开 ${Object.keys(files).length} 份文档 -> docs/features/${name}/`)
  process.exit(0)
}

for (const [file, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, file), content)
}
console.log(`[feature] 已由 brief 展开 ${Object.keys(files).length} 份文档 -> docs/features/${name}/`)
console.log(`[feature] 校验: node scripts/check-delivery.cjs --feature ${name}`)

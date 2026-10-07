#!/usr/bin/env npx tsx
/**
 * 从一句话需求生成「需求 / 设计 / 原型 / 任务」四件套骨架。
 *
 * 为什么要有: AGENTS §6.1 规定 `requirements.md → design.md → tasks.md` 是**唯一权威
 * 单向推导链**，但这条链此前只存在于散文里 —— 每个 agent 都要重新理解一遍格式。
 * 这个工具给的是**结构与约束**（哪些小节必须有、每节对应哪个门禁、状态怎么收敛），
 * 内容仍由模型填 —— 填没填**由 check-delivery.cjs 判定**，骨架不会被当成完成。
 *
 * 用法:
 *   npx tsx scripts/create-feature.ts --name ecommerce --domain shop --title "电商平台"
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(__dirname, "..")
const arg = (flag: string): string | undefined => {
  const index = process.argv.indexOf(flag)
  return index >= 0 ? process.argv[index + 1] : undefined
}

const name = arg("--name")
const domain = arg("--domain")
const title = arg("--title") ?? name
if (!name || !domain) {
  console.error("用法: npx tsx scripts/create-feature.ts --name <特性名> --domain <域名> --title \"<标题>\"")
  process.exit(2)
}

const dir = path.join(ROOT, "docs", "features", name)
if (fs.existsSync(dir) && !process.argv.includes("--force")) {
  console.error(`[feature] ${path.relative(ROOT, dir)} 已存在（加 --force 覆盖骨架；已填内容会被覆盖，谨慎）`)
  process.exit(2)
}
fs.mkdirSync(dir, { recursive: true })

// 每份骨架都带 <!-- 待填 --> 标记 —— check-delivery.cjs 按它判定"还是骨架"
const files: Record<string, string> = {
  "requirements.md": `# 需求：${title}

状态：\`DRAFT\`　特性：\`${name}\`　域名：\`${domain}\`

## 1. 目标
<!-- 待填: 一句话说清"做完之后谁能做成什么事"。范围要收得住。 -->

## 2. 角色
<!-- 待填: 表格 —— 角色 | 能力。至少 2 个角色（运营端 / 使用端）。 -->

## 3. 用户故事（按优先级）
<!-- 待填: 至少 3 条，标 P0/P1/P2。P0 必须是"能跑通最小闭环"的那些。 -->
1. **P0**
2. **P0**
3. **P1**

## 4. 约束
<!-- 待填: 引用基座既有铁律（多租户 §4.8 / 跨域走 Facade §3.3 / 不新增原生域 §17.3 /
     全动词 API §5.1 / Agent-Native 属性 §5.2.1），并写明本特性特有的约束。 -->

## 5. 验收标准
<!-- 待填: 每条都要**可执行验证**（有命令或断言），不要写"体验良好"这类无法验收的话。 -->
1. \`npm run check\` exit=0
2.

## 6. 不做什么
<!-- 待填: 显式划出边界。这一节能挡掉一半的范围蔓延。 -->
`,
  "design.md": `# 设计：${title}

上游：\`docs/features/${name}/requirements.md\`（本文件不得反向修改需求）

## 1. 架构
<!-- 待填: 画清楚数据流与依赖方向。跨域**只走 Facade**，并写明用的是哪个域的哪个方法。 -->

## 2. 数据
<!-- 待填: 表 | 关键列 | 说明。表定义真源 = 低代码元数据（§9.5），不手写 DDL。 -->

## 3. 关键不变量
<!-- 待填: 至少 1 条，且**与验收标准一一对应**。这是设计的核心，不是装饰。 -->

## 4. UI
<!-- 待填: admin 与 C 端各有什么页面、复用哪个模板。UI 规范见 §5.2，Agent-Native 见 §5.2.1。 -->

## 5. 运维与运营
<!-- 待填: 门禁链、部署方式、agent:ops 的体检/造数与清数目标。 -->

## 6. 风险
<!-- 待填: 风险 | 处理。至少 2 条，写真实会出问题的地方。 -->
`,
  "prototype.md": `# 原型：${title}

上游：\`design.md\`。线框用文本表达（agent 可直接读，不需要图）。

## 1. 主要页面
<!-- 待填: 用文本线框画出主要页面（含顶部操作栏/搜索栏/表格/分页/弹窗）。 -->

## 2. 交互要点
<!-- 待填: 搜索回车、重置、二次确认、弹窗打开时底层 inert（§5.2.1）。 -->

## 3. 状态与空态
<!-- 待填: 加载中 / 空数据 / 出错 / 无权限 四种表现，缺一不可。 -->
`,
  "tasks.md": `# 任务：${title}

上游：\`design.md\`。规格变化必须退回规划阶段（§6.1）。

> **两条硬规矩**（对齐 CMMI「主线-支线任务树」与「1 Task = 1 Commit」）:
> 1. **归属**必须写 \`main\`（主线）或某个已存在的任务 ID —— **不允许孤儿任务**
> 2. **文件白名单**必填（逗号分隔）—— 该任务只许改这些文件，提交时会被核对
>
> 完成度**不看这里的"状态"列**，而是从 git 推导: commit message 里带 \`[T<ID>]\`（方括号）
> 且改动文件落在白名单内，才算这条任务真的做了（\`npm run task:verify\`）。

| ID | 归属 | 任务 | 文件白名单 | 状态 |
|---|---|---|---|---|
| T1 | main | <!-- 待填: 第一条主线任务 --> | <!-- 待填: path/a.ts, path/b.ts --> | 未开始 |
| T2 | main | <!-- 待填 --> | <!-- 待填 --> | 未开始 |

## 依赖
<!-- 待填: 画出 DAG。B 依赖 A 就写 A → B，别让 agent 猜顺序。 -->

## 阶段状态
* 规划：\`DRAFT\`
* 开发：待开始
* 独立测试：待开始
`,
  "bugs.md": `# 缺陷：${title}

> 每条缺陷必须带**复现命令**与**验证命令**。没有复现步骤的缺陷描述**无法被独立验证** ——
> 那它就只是一句话，不是缺陷记录（对齐 §6.1「独立测试」的精神）。
> 状态取值: \`未修\` / \`已修\` / \`不修\`。空表是合法的（当前无缺陷）。

| ID | 现象 | 复现命令 | 验证命令 | 状态 |
|---|---|---|---|---|
`,
}

for (const [file, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, file), content)
}
fs.writeFileSync(
  path.join(dir, "feature.json"),
  JSON.stringify(
    { name, domain, title, upstream: ["requirements.md", "design.md", "prototype.md", "tasks.md"] },
    null,
    2,
  ) + "\n",
)
console.log(`[feature] 已生成骨架 docs/features/${name}/（7 份文档 + feature.json）`)
console.log(`[feature] 下一步: 填完 <!-- 待填 --> 小节，然后 node scripts/check-delivery.cjs --feature ${name}`)

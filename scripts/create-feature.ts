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

## 任务清单
<!-- 待填: 至少 3 条。每条要能被**独立验证**（有命令或断言）。 -->
- [ ] T1
- [ ] T2
- [ ] T3

## 依赖
<!-- 待填: 画出 DAG。B 依赖 A 就写 A → B，别让 agent 猜顺序。 -->

## 阶段状态
* 规划：\`DRAFT\`
* 开发：待开始
* 独立测试：待开始
`,
  "selection.md": `# 选型与研判（G0 · DAR）：${title}

> **立项前的门禁。** 跳过它就会「需求未明、先定框架」—— 选错底座后期推倒重来，
> 或踩进 License 侵权。结论必须有**加权打分**，不是一句话拍板。

## 1. 候选方案
<!-- 待填: 表格 —— 候选 | 类型(自研/开源/商业) | 许可证 | 社区活跃度 | 许可风险 -->

## 2. 竞品对标
<!-- 待填: 同行业/同场景别人怎么做，各自代价。 -->

## 3. 开源生态扫描
<!-- 待填: 检索了哪些库/框架，为什么选它、为什么不选其它的。 -->

## 4. License 合规结论
<!-- 待填: **必须有明确结论**。可商用/需开源/需购买/不可用 —— 并说明传染性风险(如 GPL/AGPL)。 -->

## 5. 加权打分与结论
<!-- 待填: 维度 × 权重 × 得分 → 总分；给出推荐项与不选的理由。 -->
`,
  "deployment.md": `# 实施轨：基础设施与网络策略（G5）：${title}

> **双轨的另一轨。** 运营商级项目约 40% 的风险与周期在这里:
> 端口策略审批、网络域划分、堡垒机纳管、等保基线、凌晨割接与回滚。
> 它**不是**"部署那一步"，是一条与研发并行的轨。

## 1. 端口策略矩阵（Port Matrix）
<!-- 待填: 源域 | 目的域 | 端口/协议 | 用途 | 审批状态。跨区连通必须写清。 -->

## 2. 网络域规划
<!-- 待填: DMZ / B域 / O域 / M域 划分与各域承载的服务。 -->

## 3. 接入与加固
<!-- 待填: 4A/堡垒机纳管、等保基线项、证书与密钥来源。 -->

## 4. 割接方案
<!-- 待填: 时间窗口、步骤、会签方、验证点（每步怎么确认成功）。 -->

## 5. 回滚预案（Runbook）
<!-- 待填: **必须可计时执行**。触发条件、回滚步骤、预计耗时、验证命令。 -->
`,
  "evidence.json": `{
  "schemaVersion": 1,
  "feature": "${name}",
  "note": "每个 gate 的独立证据。对齐 CMMI: 证据**不可跨角色借用**；not_applicable **必须**给理由；passed **必须**有证据。",
  "gates": {
    "G0_DAR": { "status": "pending", "owner": "架构/售前", "evidence": [], "summary": "" },
    "G1_FDA": { "status": "pending", "owner": "架构", "evidence": [], "summary": "" },
    "G2_CoreSWE": { "status": "pending", "owner": "开发", "evidence": [], "summary": "" },
    "G3_FDSE": { "status": "pending", "owner": "测试", "evidence": [], "summary": "" },
    "G4_DS": { "status": "pending", "owner": "产品/业务", "evidence": [], "summary": "" },
    "G5_PRE": { "status": "pending", "owner": "实施/SRE", "evidence": [], "summary": "" }
  }
}
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

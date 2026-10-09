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
const specType = arg("--type") ?? "feature" // feature | bugfix | enhancement | refactor
if (!name || !domain) {
  console.error("用法: npx tsx scripts/create-feature.ts --name <名称> --domain <域名> --title \"<标题>\" [--type feature|bugfix|enhancement|refactor]")
  process.exit(2)
}

const dir = path.join(ROOT, "docs", "features", name)
if (fs.existsSync(dir) && !process.argv.includes("--force")) {
  console.error(`[spec] ${path.relative(ROOT, dir)} 已存在（加 --force 覆盖骨架；已填内容会被覆盖，谨慎）`)
  process.exit(2)
}
fs.mkdirSync(dir, { recursive: true })

// 每份骨架都带 <!-- 待填 --> 标记 —— check-delivery.cjs 按它判定"还是骨架"
// **只生成一份 brief** —— 文档由 build-feature.cjs 展开。
// 根据 specType (feature / bugfix / enhancement / refactor) 派生精准模板：
const brief = specType === "bugfix"
  ? {
      name,
      domain,
      title,
      type: "bugfix",
      goal: "<!-- 待填: 一句话说清『修复什么缺陷，恢复何种预期行为』 -->",
      symptom: "<!-- 待填: 缺陷表现、异常日志或复现步骤 -->",
      rootCause: "<!-- 待填: 代码/设计层面的根本原因 -->",
      roles: [
        { role: "受影响用户", can: "正常使用受影响业务，不再遭遇异常中断" },
        { role: "运维/排障工程师", can: "通过监控与自动化测试核实问题已彻底根治" },
      ],
      stories: [
        { priority: "P0", text: "<!-- 待填: 修复核心缺陷并提供红灯复现单测 -->" },
        { priority: "P0", text: "<!-- 待填: 修复后增加防重入与状态边界守卫 -->" },
        { priority: "P1", text: "<!-- 待填: 完善不可变操作日志与指标告警 -->" },
      ],
      constraints: [
        "零破坏性变更：不得破坏已有接口与旧版本数据兼容性。",
        "反假 Mock：必须由真实测试用例复现并验证修复。",
      ],
      acceptance: [
        { check: "`npm run check` exit=0" },
        { check: "<!-- 待填: 缺陷复现用例从 Red 变绿 (PASS) -->" },
      ],
      nonGoals: ["<!-- 待填: 不在本次修补中引入未经验证的重构 -->"],
      architecture: "<!-- 待填: 缺陷涉及的代码链路与修补方案 -->",
      entities: [{ table: "<!-- 待填: 涉及的表名（若无写 - ） -->", note: "<!-- 待填 -->" }],
      invariants: [{ name: "<!-- 待填: 防御不变量（如 并发安全） -->", how: "<!-- 待填: 如何在代码层彻底杜绝次生灾害 -->" }],
      ui: ["<!-- 待填: 若涉及 UI 交互缺陷提供修复前后对比；若为纯后端逻辑写『无 UI 变更』 -->"],
      ops: ["<!-- 待填: 热修复生效机制、回滚与线上核对命令 -->"],
      risks: [{ risk: "<!-- 待填: 修复可能带来的次生影响 -->", mitigation: "<!-- 待填: 缓解策略 -->" }],
      screens: [{ name: "<!-- 待填: 缺陷页面或写『纯后端无页面』 -->", wireframe: "<!-- 待填: 线框或修复对比说明 -->" }],
      interactions: ["<!-- 待填: 交互修复细节 -->"],
      states: ["加载中：正常展示。", "空数据：正常展示。", "出错：拦截非法状态并不崩毁。", "成功：修复后正常流转。"],
      candidates: [{ name: "原位修补", type: "自研", license: "MIT", risk: "无" }],
      benchmarks: ["<!-- 待填: 业界类似缺陷的防御解法 -->"],
      scan: ["<!-- 待填: 检索了哪些历史 commit / issue -->"],
      licenseConclusion: "可商用，无合规风险",
      tasks: [
        { id: "T1", parent: "main", title: "编写红灯复现测试用例 (Red Test)", files: ["<!-- 待填: 测试文件 -->"] },
        { id: "T2", parent: "T1", title: "修复业务缺陷并增加防御守卫", files: ["<!-- 待填: 业务代码 -->"] },
        { id: "T3", parent: "main", title: "全量回归测试与门禁验证", files: ["-"] },
      ],
      dependencies: "T1 → T2 → T3",
      windowMinutes: 10,
    }
  : {
      name,
      domain,
      title,
      type: specType,
      goal: "<!-- 待填: 一句话说清『做完之后谁能做成什么事』。范围要收得住。 -->",
      roles: [
        { role: "<!-- 待填: 运营端角色 -->", can: "<!-- 待填 -->" },
        { role: "<!-- 待填: 使用端角色 -->", can: "<!-- 待填 -->" },
      ],
      stories: [
        { priority: "P0", text: "<!-- 待填: 最小闭环必须有的 -->" },
        { priority: "P0", text: "<!-- 待填 -->" },
        { priority: "P1", text: "<!-- 待填 -->" },
      ],
      constraints: [
        "多租户：业务表带 tenant_id，从全局上下文取，禁止调用方透传（§4.8）。",
        "跨域：只走 Domain Facade，不 import 别的域 Service（§3.3）。",
        "定制业务不回写基座（§17.3）；全动词 API（§5.1）；UI 带 Agent-Native 属性（§5.2.1）。",
      ],
      acceptance: [
        { check: "`npm run check` exit=0" },
        { check: "<!-- 待填: 每条都要可执行验证，不要写『体验良好』 -->" },
      ],
      nonGoals: ["<!-- 待填: 显式划出边界，这一节能挡掉一半范围蔓延 -->"],
      architecture: "<!-- 待填: 数据流与依赖方向；跨域写明用哪个域的哪个方法 -->",
      entities: [{ table: "<!-- 待填: 表名 -->", note: "<!-- 待填 -->" }],
      invariants: [{ name: "<!-- 待填: 不变量名（如 不超卖） -->", how: "<!-- 待填: 怎么保证，且要与验收标准对应 -->" }],
      ui: ["<!-- 待填: admin 与 C 端各有什么页面、复用哪个模板 -->"],
      ops: ["<!-- 待填: 门禁链、部署方式、agent:ops 的体检/造数/清数 -->"],
      risks: [{ risk: "<!-- 待填 -->", mitigation: "<!-- 待填 -->" }],
      screens: [{ name: "<!-- 待填: 页面名与路径 -->", wireframe: "<!-- 待填: 文本线框 -->" }],
      interactions: ["<!-- 待填: 搜索回车、二次确认、弹窗时底层 inert（§5.2.1） -->"],
      states: ["加载中：表格区一行，不整页遮罩。", "空数据：保留搜索栏（可改条件重试）。", "出错：提示 + 可重试，不静默吞掉。", "无权限：按钮不渲染（权限码驱动）。"],
      candidates: [{ name: "<!-- 待填: 候选方案 -->", type: "<!-- 自研/开源/商业 -->", license: "<!-- SPX -->", risk: "<!-- 许可风险 -->" }],
      benchmarks: ["<!-- 待填: 同行业/同场景别人怎么做，各自代价 -->"],
      scan: ["<!-- 待填: 检索了哪些库/框架，为什么选它/不选别的 -->"],
      licenseConclusion: "<!-- 待填: 必须有明确结论。可商用/需开源/需购买/不可用 + 传染性风险 -->",
      tasks: [
        { id: "T1", parent: "main", title: "<!-- 待填: 第一条主线任务 -->", files: ["<!-- 待填: 文件白名单，逗号分隔；纯验证任务写 - -->"] },
        { id: "T2", parent: "T1", title: "<!-- 待填 -->", files: ["-"] },
        { id: "T3", parent: "main", title: "<!-- 待填 -->", files: ["-"] },
      ],
      dependencies: "<!-- 待填: 画出 DAG，如 T1 → T2 -->",
      windowMinutes: 10,
    }

fs.writeFileSync(path.join(dir, "brief.json"), JSON.stringify(brief, null, 2) + "\n")
// 证据台账与缺陷清单是**固定结构**（不是"填内容"），引擎直接产出
fs.writeFileSync(
  path.join(dir, "evidence.json"),
  JSON.stringify(
    {
      schemaVersion: 1,
      feature: name,
      note: "每个 gate 的独立证据。证据不可跨角色借用；not_applicable 必须给理由；passed 必须有证据。",
      gates: Object.fromEntries(
        ["G0_DAR", "G1_FDA", "G2_CoreSWE", "G3_FDSE", "G4_DS", "G5_PRE"].map((gate) => [
          gate,
          { status: "pending", owner: "-", evidence: [], summary: "" },
        ]),
      ),
    },
    null,
    2,
  ) + "\n",
)
console.log(`[feature] 已生成 docs/features/${name}/brief.json（一份声明，替代 7 份文档骨架）`)
console.log(`[feature] 下一步: 填 brief（约 500 token），然后 node scripts/build-feature.cjs --name ${name}`)
console.log(`[feature] 展开后校验: node scripts/check-delivery.cjs --feature ${name}`)
fs.writeFileSync(
  path.join(dir, "feature.json"),
  JSON.stringify(
    { name, domain, title, type: specType, upstream: ["requirements.md", "design.md", "prototype.md", "tasks.md"] },
    null,
    2,
  ) + "\n",
)
fs.writeFileSync(
  path.join(dir, "spec.json"),
  JSON.stringify(
    { name, domain, title, type: specType, upstream: ["requirements.md", "design.md", "prototype.md", "tasks.md"] },
    null,
    2,
  ) + "\n",
)
// 创建原型资源目录 assets/ 与 prototypes/
const assetsDir = path.join(dir, "assets")
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true })
  fs.writeFileSync(
    path.join(assetsDir, "README.md"),
    "# 原型视觉设计图与切图资源 (assets/)\n\n在此存放：\n- PNG / JPG 高保真设计图、界面截图、线框图\n- SVG 交互流程图与矢量图表\n- GIF 操作演示动图\n\n在 `../prototype.md` 中直接引用：`![原型截图](./assets/01-main.png)`\n",
  )
}

const prototypesDir = path.join(dir, "prototypes")
if (!fs.existsSync(prototypesDir)) {
  fs.mkdirSync(prototypesDir, { recursive: true })
  fs.writeFileSync(
    path.join(prototypesDir, "README.md"),
    "# 可交互 HTML 原型与站点包 (prototypes/)\n\n在此存放：\n- 单文件 HTML / Tailwind / Bootstrap 可交互演示原型\n- Axure 导出的 HTML 原型站点（可浏览器直接打开预览）\n\n在 `../prototype.md` 中提供本地相对链接或说明。\n",
  )
}

console.log(`[feature] 已生成 docs/features/${name}/（brief.json + evidence.json + feature.json + assets/ + prototypes/）`)


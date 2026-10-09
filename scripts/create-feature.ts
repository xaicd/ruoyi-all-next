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

const { getTargetSpecDir } = require("./lib/spec-resolver.cjs")

const dir = process.argv.includes("--legacy")
  ? path.join(ROOT, "docs", "features", name)
  : getTargetSpecDir(name, domain)

if (fs.existsSync(dir) && !process.argv.includes("--force")) {
  console.error(`[spec] ${path.relative(ROOT, dir)} 已存在（加 --force 覆盖骨架；已填内容会被覆盖，谨慎）`)
  process.exit(2)
}
fs.mkdirSync(dir, { recursive: true })

// 每份骨架都带 <!-- 待填 --> 标记 —— check-delivery.cjs 按它判定"还是骨架"
// **只生成一份 brief** —— 文档由 build-feature.cjs 展开。
// 根据 specType (feature / bugfix / enhancement / refactor) 派生精准模板：
// 根据 specType (feature / bugfix / enhancement / refactor / security / migration) 派生精准模板：
let brief: any

if (specType === "bugfix") {
  brief = {
    name,
    domain,
    title,
    type: "bugfix",
    goal: "<!-- 待填: 一句话说清『修复什么缺陷，恢复何种预期行为』 -->",
    symptom: "<!-- 待填: 缺陷表现、异常日志或复现步骤 -->",
    rootCause: "<!-- 待填: 5-Whys 代码/设计层面的根本原因 -->",
    preservedBehavior: "<!-- 待填: 必须保持不变的既有正常功能与数据（防回归） -->",
    roles: [
      { role: "受影响用户", can: "正常使用受影响业务，不再遭遇异常中断" },
      { role: "排障/SRE 工程师", can: "通过监控告警与自动化红测核实问题已彻底根治" },
    ],
    stories: [
      { priority: "P0", text: "<!-- 待填: 编写红灯复现单测 (Red Test) 确证缺陷存在 -->" },
      { priority: "P0", text: "<!-- 待填: 原位修补业务逻辑并增加防御状态机守卫 -->" },
      { priority: "P1", text: "<!-- 待填: 补充回归测试套件并验证红灯变绿 (Green Test) -->" },
    ],
    constraints: [
      "零破坏性变更：不得破坏已有对外 API 契约与历史数据兼容性。",
      "反假 Mock：必须由真实测试数据库用例复现并验证修复。",
      "防回归保证：修复不得引入次生故障或破坏既有正常流转。",
    ],
    acceptance: [
      { check: "`npm run check` exit=0" },
      { check: "<!-- 待填: 缺陷复现用例从 Red 变绿 (100% PASS) -->" },
      { check: "<!-- 待填: 既有核心回归测试套件全部通过 (0 Regression) -->" },
    ],
    nonGoals: ["不在本次修补中引入无关功能或破坏性架构变更"],
    architecture: "<!-- 待填: 缺陷涉及的代码调用链路与修补方案架构 -->",
    entities: [{ table: "<!-- 待填: 涉及的表名（若无写 - ） -->", note: "<!-- 待填 -->" }],
    invariants: [{ name: "<!-- 待填: 防御不变量（如 并发安全） -->", how: "<!-- 待填: 如何在代码层彻底杜绝次生灾害 -->" }],
    ui: ["<!-- 待填: 若涉及 UI 交互缺陷提供修复前后对比；若为纯后端逻辑写『无 UI 变更』 -->"],
    ops: ["<!-- 待填: 热修复生效机制、回滚与线上核对命令 -->"],
    risks: [{ risk: "<!-- 待填: 修复可能带来的次生影响 -->", mitigation: "<!-- 待填: 缓解策略与回滚预案 -->" }],
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
} else if (specType === "refactor") {
  brief = {
    name,
    domain,
    title,
    type: "refactor",
    goal: "<!-- 待填: 架构重构与债务消除目标（如 解耦过长模块、消除循环依赖） -->",
    debtAnalysis: "<!-- 待填: 当前代码坏味道、过度耦合度或维护瓶颈分析 -->",
    targetArchitecture: "<!-- 待填: 目标整洁架构形态（六边形分层、Domain Facade 或插件化） -->",
    roles: [
      { role: "业务研发工程师", can: "在清晰的模块边界与分层约束下高效演进业务代码" },
      { role: "架构委员会", can: "通过静态门禁与 Seam 契约确保无架构退化" },
    ],
    stories: [
      { priority: "P0", text: "<!-- 待填: 建立等价性安全网测试（确保重构前测试全绿） -->" },
      { priority: "P0", text: "<!-- 待填: 按波次执行结构解耦与接口抽象 -->" },
      { priority: "P1", text: "<!-- 待填: 移除废弃历史代码并更新架构拓扑图 -->" },
    ],
    constraints: [
      "接口等价性：对外 HTTP/RPC 契约保持 100% 兼容，调用方零感知。",
      "平滑演进：遵循绞杀者模式 (Strangler Fig)，严禁高风险大爆炸式替换。",
    ],
    acceptance: [
      { check: "`npm run check` exit=0" },
      { check: "<!-- 待填: 真实测试矩阵 100% 通过且代码覆盖率不降低 -->" },
    ],
    nonGoals: ["不在本次重构中增加未经规划的业务新特性"],
    architecture: "<!-- 待填: 重构前后的组件拓扑与依赖流转对比 -->",
    entities: [{ table: "<!-- 待填: 涉及的表名 -->", note: "<!-- 待填 -->" }],
    invariants: [{ name: "行为等价性", how: "重构前后相同输入必须产生相同输出与副作用" }],
    ui: ["<!-- 待填: 若涉及 UI 组件重构说明复用方式；若为纯后端重构写『无 UI 变更』 -->"],
    ops: ["<!-- 待填: 灰度发布方案与回滚演练 -->"],
    risks: [{ risk: "重构可能遗漏隐式依赖", mitigation: "依靠完整的真实测试安全网拦截" }],
    screens: [{ name: "架构重构", wireframe: "模块拓扑优化" }],
    interactions: ["保持既有交互不变"],
    states: ["加载中：正常展示。", "空数据：正常展示。", "出错：正常展示。", "成功：正常展示。"],
    candidates: [{ name: "分步重构", type: "自研", license: "MIT", risk: "无" }],
    benchmarks: ["业界微服务与六边形架构最佳实践"],
    scan: ["静态分析与代码复杂度扫描产物"],
    licenseConclusion: "可商用，无合规风险",
    tasks: [
      { id: "T1", parent: "main", title: "固化等价性测试基线 (Safety Net)", files: ["<!-- 待填: 测试文件 -->"] },
      { id: "T2", parent: "T1", title: "执行分层解耦与门面抽象", files: ["<!-- 待填: 重构代码 -->"] },
      { id: "T3", parent: "main", title: "全量验证与坏味道扫描清零", files: ["-"] },
    ],
    dependencies: "T1 → T2 → T3",
    windowMinutes: 15,
  }
} else if (specType === "enhancement") {
  brief = {
    name,
    domain,
    title,
    type: "enhancement",
    goal: "<!-- 待填: 性能优化或能力增强目标（如 QPS 提升 3 倍、p95 降至 20ms） -->",
    baselineMetric: "<!-- 待填: 当前性能基线（如 RPS 5,000，p95 100ms） -->",
    targetMetric: "<!-- 待填: 预期优化目标（如 RPS 20,000+，p95 <= 20ms） -->",
    roles: [
      { role: "高并发终端用户", can: "享受极速、低延迟与高吞吐的业务响应" },
      { role: "SRE / 稳定性负责人", can: "降低系统资源开销并拓宽错误预算" },
    ],
    stories: [
      { priority: "P0", text: "<!-- 待填: 优化核心瓶颈链路（如 查询缓存、批量聚合） -->" },
      { priority: "P0", text: "<!-- 待填: 建立基准压测与回归对比用例 -->" },
      { priority: "P1", text: "<!-- 待填: 配置 Prometheus/OpenTelemetry 监控大盘 -->" },
    ],
    constraints: [
      "零数据损失：性能优化不得以牺牲数据强一致性或审计完整性为代价。",
      "容量护栏：单机独立进程吞吐必须达到基线要求。",
    ],
    acceptance: [
      { check: "`npm run check` exit=0" },
      { check: "<!-- 待填: 压测报告显示达成目标指标（RPS / p95） -->" },
    ],
    nonGoals: ["不在本次优化中改动核心业务数据模型"],
    architecture: "<!-- 待填: 性能加速链路（如 局部缓存、非阻塞 I/O） -->",
    entities: [{ table: "<!-- 待填: 涉及的表名 -->", note: "<!-- 待填 -->" }],
    invariants: [{ name: "数据幂等与一致性", how: "高并发场景下防超卖与防脏读" }],
    ui: ["<!-- 待填: 响应提速体感优化 -->"],
    ops: ["<!-- 待填: 压测脚本、监控指标与限流熔断阈值 -->"],
    risks: [{ risk: "缓存穿透/击穿/雪崩", mitigation: "设置随机 TTL 与互斥锁兜底" }],
    screens: [{ name: "性能大盘", wireframe: "监控仪表盘" }],
    interactions: ["保持既有交互不变"],
    states: ["加载中：正常展示。", "空数据：正常展示。", "出错：正常展示。", "成功：正常展示。"],
    candidates: [{ name: "本地缓存与索引优化", type: "自研", license: "MIT", risk: "无" }],
    benchmarks: ["Google SRE 容量管理实践"],
    scan: ["链路性能 Profile 与 FlameGraph 分析"],
    licenseConclusion: "可商用，无合规风险",
    tasks: [
      { id: "T1", parent: "main", title: "建立压测性能基线 (Baseline Benchmark)", files: ["<!-- 待填: 测试文件 -->"] },
      { id: "T2", parent: "T1", title: "实现性能优化与瓶颈消解", files: ["<!-- 待填: 核心优化代码 -->"] },
      { id: "T3", parent: "main", title: "运行对照压测并验证达标", files: ["-"] },
    ],
    dependencies: "T1 → T2 → T3",
    windowMinutes: 10,
  }
} else if (specType === "security") {
  brief = {
    name,
    domain,
    title,
    type: "security",
    goal: "<!-- 待填: 安全漏洞加固或红队防御建设目标（如 修复越权、AST SQL 防注入） -->",
    vulnerabilityAdvisory: "<!-- 待填: 漏洞描述、威胁评级与 PoC 攻击向量 -->",
    attackSurface: "<!-- 待填: 暴露的接口面与潜在安全威胁 -->",
    roles: [
      { role: "合规安全主管", can: "确信系统符合零信任防御标准与等保合规要求" },
      { role: "红蓝对抗工程师", can: "通过 Strix 自主渗透测试验证漏洞已彻底闭环" },
    ],
    stories: [
      { priority: "P0", text: "<!-- 待填: 编写安全 PoC 复现用例验证漏洞存在 -->" },
      { priority: "P0", text: "<!-- 待填: 增加纵深防御机制（AST 校验、签名验算、租户强制过滤） -->" },
      { priority: "P1", text: "<!-- 待填: 运行 Strix 红队自主扫描核实 100% 抵御 -->" },
    ],
    constraints: [
      "零信任原则：严禁信任客户端传入的租户 ID 或身份声明。",
      "最小权限：接口必须严格绑定 Permission Code 权限码。",
    ],
    acceptance: [
      { check: "`npm run check` exit=0" },
      { check: "`npm run security:scan` exit=0 (12 项基础扫描全过)" },
      { check: "<!-- 待填: PoC 攻击用例被 100% 拦截并记录安全审计 -->" },
    ],
    nonGoals: ["不盲目引入重型第三方商业安全 WAF 依赖"],
    architecture: "<!-- 待填: 安全防护切面与数据过滤管道 -->",
    entities: [{ table: "<!-- 待填: 涉及的表名 -->", note: "<!-- 待填 -->" }],
    invariants: [{ name: "不可变安全审计", how: "所有安全拦截与权限变更必须记入审计表" }],
    ui: ["<!-- 待填: 敏感数据脱敏展示 -->"],
    ops: ["<!-- 待填: 安全事件告警通知与 IP 黑名单联动 -->"],
    risks: [{ risk: "安全策略误杀正常业务请求", mitigation: "提供灰度观察模式并设立白名单豁免" }],
    screens: [{ name: "安全日志", wireframe: "审计大盘" }],
    interactions: ["敏感操作强制二次认证"],
    states: ["加载中：正常展示。", "空数据：正常展示。", "出错：脱敏提示，不泄露调用栈。", "成功：正常展示。"],
    candidates: [{ name: "内建 AST 与过滤器加固", type: "自研", license: "MIT", risk: "无" }],
    benchmarks: ["OWASP Top 10 与 Strix 红队标准"],
    scan: ["历史 CVE 库与静态代码安全分析"],
    licenseConclusion: "可商用，无合规风险",
    tasks: [
      { id: "T1", parent: "main", title: "编写安全 PoC 攻击复现用例", files: ["<!-- 待填: 测试文件 -->"] },
      { id: "T2", parent: "T1", title: "落地纵深防御与上下文校验拦截器", files: ["<!-- 待填: 安全代码 -->"] },
      { id: "T3", parent: "main", title: "运行安全渗透扫描并签署合规审计", files: ["-"] },
    ],
    dependencies: "T1 → T2 → T3",
    windowMinutes: 10,
  }
} else {
  // 默认 feature
  brief = {
    name,
    domain,
    title,
    type: "feature",
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
console.log(`[spec] 已生成 ${path.relative(ROOT, dir)}/brief.json（一份声明，替代 7 份文档骨架）`)
console.log(`[spec] 下一步: 填 brief（约 500 token），然后 node scripts/build-feature.cjs --name ${name}`)
console.log(`[spec] 展开后校验: node scripts/check-delivery.cjs --feature ${name}`)
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

console.log(`[spec] 已生成 ${path.relative(ROOT, dir)}/（brief.json + evidence.json + spec.json + assets/ + prototypes/）`)


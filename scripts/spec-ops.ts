#!/usr/bin/env npx tsx
/**
 * ============================================================================
 * Kiro 规范驱动开发控制台 (Spec-Ops Engine: Unified SDD CLI)
 * ============================================================================
 *
 * 核心目的：
 * 统一收敛所有规格生命周期操作（创建、编译展开、交付门禁检查、归档与健康扫描），
 * 替代原散落的 create-feature / build-feature 命令，彻底消除“所有事务皆 Feature”
 * 的低阶思维，全面赋能 feature / bugfix / enhancement / refactor / security 全类型规格。
 *
 * 用法 (CLI Usage):
 *   # 1. 创建任意类型的规格骨架
 *   npx tsx scripts/spec-ops.ts new --name <名> --domain <域> --title "<标题>" [--type feature|bugfix|enhancement|refactor|security]
 *
 *   # 2. 从 brief.json 展开编译生成 7~8 份完备 Markdown 规格与任务波次图
 *   npx tsx scripts/spec-ops.ts build --name <名> [--check]
 *
 *   # 3. 校验规格交付状态与门禁
 *   npx tsx scripts/spec-ops.ts check [--spec <名>] [--phase <阶段>]
 *
 *   # 4. 列出全域活跃与归档规格
 *   npx tsx scripts/spec-ops.ts list [--domain <域>]
 *
 *   # 5. 上线后一键防污染归档
 *   npx tsx scripts/spec-ops.ts archive --name <名>
 *
 *   # 6. 规格健康与防污染扫描
 *   npx tsx scripts/spec-ops.ts health
 */

import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

const ROOT = path.resolve(__dirname, "..")

// 引入统一规格解析器
const {
  ROOT: SPEC_ROOT,
  resolveSpecDir,
  getTargetSpecDir,
  listAllSpecs,
} = require("./lib/spec-resolver.cjs")

// 参数解析助手
const args = process.argv.slice(2)
let command = args[0] && !args[0].startsWith("-") ? args[0] : ""

// 兼容智能推断：如果未给子命令但给了参数
if (!command) {
  if (args.includes("--name") && args.includes("--domain")) {
    command = "new"
  } else if (args.includes("--name") && (args.includes("--check") || args.includes("--build"))) {
    command = "build"
  } else {
    command = "help"
  }
}

const getArg = (flag: string): string | undefined => {
  const index = args.indexOf(flag)
  return index >= 0 && index + 1 < args.length ? args[index + 1] : undefined
}

const hasFlag = (flag: string): boolean => args.includes(flag)

// ============================================================================
// 1. 命令：spec-ops new (创建规格骨架)
// ============================================================================
function handleNew() {
  const name = getArg("--name")
  const domain = getArg("--domain")
  const title = getArg("--title") ?? name
  const specType = getArg("--type") ?? "feature"
  const isForce = hasFlag("--force")
  const isLegacy = hasFlag("--legacy")

  if (!name || !domain) {
    console.error("❌ 用法错误: npx tsx scripts/spec-ops.ts new --name <名称> --domain <域名> --title \"<标题>\" [--type feature|bugfix|enhancement|refactor|security]")
    process.exit(2)
  }

  const dir = isLegacy
    ? path.join(ROOT, "docs", "features", name)
    : getTargetSpecDir(name, domain)

  if (fs.existsSync(dir) && !isForce) {
    console.error(`❌ [spec-ops] 规格目录已存在: ${path.relative(ROOT, dir)}（使用 --force 覆盖骨架，注意已填内容会被覆盖）`)
    process.exit(2)
  }

  fs.mkdirSync(dir, { recursive: true })

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
      ui: ["<!-- 待填: 若涉及 UI 则写明修复前后对比，无则写『不涉及 UI 调整』 -->"],
      ops: ["<!-- 待填: 缺陷告警阈值修正与复现测试脚本运行 -->"],
      risks: [{ risk: "修复引入隐蔽次生分支影响", mitigation: "执行覆盖全域的真实数据库测试矩阵与回滚演练" }],
      screens: [{ name: "故障修复面", wireframe: "无变更/微调" }],
      interactions: ["保持既有交互模式不变"],
      states: ["加载中：正常展示。", "空数据：正常展示。", "出错：正常展示，具备明确指引。", "成功：正常展示。"],
      candidates: [{ name: "原位修补", type: "自研", license: "MIT", risk: "无" }],
      benchmarks: ["业内标准防御模式"],
      scan: ["关联调用链与历史缺陷库"],
      licenseConclusion: "无引入外部第三方库风险",
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
      goal: "<!-- 待填: 一句话说清『重构目标：消除哪些技术债，达到何种架构整洁度』 -->",
      debtAnalysis: "<!-- 待填: 现有架构痛点、耦合点与坏味道 (Code Smells) -->",
      targetArchitecture: "<!-- 待填: 重构后的领域边界、分层与交互契约 -->",
      roles: [
        { role: "业务研发工程师", can: "在整洁清晰的分层架构下快速扩展新特性" },
        { role: "架构委员会/审计员", can: "确信重构遵循领域边界铁律且无业务行为漂移" },
      ],
      stories: [
        { priority: "P0", text: "<!-- 待填: 确立业务等价性安全网单测 (Parity Tests) -->" },
        { priority: "P0", text: "<!-- 待填: 运用绞杀者模式 (Strangler Fig) 逐步迁移模块 -->" },
        { priority: "P1", text: "<!-- 待填: 清除冗余遗留样板并验证全部门禁 -->" },
      ],
      constraints: [
        "功能等价性：重构前后外部对外 API 行为与返回值 100% 等价保持。",
        "跨域通信：必须经过 Domain Facade，禁止违规侵入内部私有服务。",
      ],
      acceptance: [
        { check: "`npm run check` exit=0" },
        { check: "`npm run test:matrix` exit=0 (真实 SQLite 矩阵 100% 通过)" },
        { check: "<!-- 待填: 业务等价性单测全部通过 -->" },
      ],
      nonGoals: ["不在本次重构中增加未经评审的业务新功能"],
      architecture: "<!-- 待填: 目标分层架构图与依赖倒置示意 -->",
      entities: [{ table: "<!-- 待填: 涉及的表名 -->", note: "<!-- 待填 -->" }],
      invariants: [{ name: "业务数据零破坏", how: "重构不涉及数据库表物理结构的破坏性变更" }],
      ui: ["<!-- 待填: 界面结构与交互完全保持等价 -->"],
      ops: ["<!-- 待填: 灰度切换方案与快速回滚预案 -->"],
      risks: [{ risk: "隐式隐蔽副作用未被覆盖", mitigation: "变异测试打假与全量真实数据库集成测试" }],
      screens: [{ name: "重构涉及模块", wireframe: "保持既有线框不变" }],
      interactions: ["保持既有交互模式不变"],
      states: ["加载中：正常展示。", "空数据：正常展示。", "出错：正常展示。", "成功：正常展示。"],
      candidates: [{ name: "模块化重构方案", type: "自研", license: "MIT", risk: "无" }],
      benchmarks: ["Clean Architecture 与 DDD 规范"],
      scan: ["全仓静态分析与依赖引用图"],
      licenseConclusion: "无外部依赖许可风险",
      tasks: [
        { id: "T1", parent: "main", title: "建立业务等价性自动化测试基线", files: ["<!-- 待填: 测试文件 -->"] },
        { id: "T2", parent: "T1", title: "按领域分层重构实现与契约迁移", files: ["<!-- 待填: 重构代码 -->"] },
        { id: "T3", parent: "main", title: "清理旧实现并验证无回归债务", files: ["-"] },
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
      goal: "<!-- 待填: 一句话说清『性能/容量/可用性优化目标与量化指标』 -->",
      baselineMetric: "<!-- 待填: 当前基线表现（如 p95 响应时间、吞吐 RPS、CPU 使用率） -->",
      targetMetric: "<!-- 待填: 优化后的目标指标（如 p95 < 50ms, RPS > 10,000） -->",
      roles: [
        { role: "终端访问用户", can: "享受极速流畅的接口响应与毫秒级渲染" },
        { role: "SRE 稳定性工程师", can: "确信高并发峰值期系统具备充足容量与熔断护栏" },
      ],
      stories: [
        { priority: "P0", text: "<!-- 待填: 建立标准性能测试基准用例 (Benchmark) -->" },
        { priority: "P0", text: "<!-- 待填: 消除热点锁竞争/慢查询/冗余 I/O -->" },
        { priority: "P1", text: "<!-- 待填: 运行真实压测验证吞吐与耗时达标 -->" },
      ],
      constraints: [
        "容量护栏：高负载下不得发生内存泄露或连接池耗尽。",
        "数据强一致性：性能优化绝不能牺牲事务隔离性与多租户安全。",
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

  const evidence = {
    feature: name,
    domain,
    type: specType,
    created: new Date().toISOString(),
    trace: { brief: "brief.json", spec: "spec.json" },
  }
  fs.writeFileSync(path.join(dir, "evidence.json"), JSON.stringify(evidence, null, 2) + "\n")

  const specMeta = {
    name,
    domain,
    title,
    type: specType,
    status: "PLAN_APPROVED",
    createdAt: new Date().toISOString(),
    version: "1.0.0",
  }
  fs.writeFileSync(path.join(dir, "spec.json"), JSON.stringify(specMeta, null, 2) + "\n")

  fs.mkdirSync(path.join(dir, "assets"), { recursive: true })
  fs.mkdirSync(path.join(dir, "prototypes"), { recursive: true })

  console.log(`\n✨ [spec-ops] 成功创建 ${specType} 规格骨架: ${path.relative(ROOT, dir)}/`)
  console.log(`   📄 声明真源: ${path.relative(ROOT, path.join(dir, "brief.json"))} (<500 Tokens，防样板浪费)`)
  console.log(`   🚀 下一步: 编辑 brief.json，然后执行:`)
  console.log(`      npx tsx scripts/spec-ops.ts build --name ${name}`)
}

// ============================================================================
// 2. 命令：spec-ops build (展开生成规格文档)
// ============================================================================
function handleBuild() {
  const name = getArg("--name") || getArg("--spec")
  const checkOnly = hasFlag("--check")

  if (!name) {
    console.error("❌ 用法错误: npx tsx scripts/spec-ops.ts build --name <规格名> [--check]")
    process.exit(2)
  }

  const dir = resolveSpecDir(name)
  if (!dir) {
    console.error(`❌ [spec-ops] 找不到规格: ${name}（请先运行 npx tsx scripts/spec-ops.ts new 创建）`)
    process.exit(2)
  }

  const briefPath = path.join(dir, "brief.json")
  if (!fs.existsSync(briefPath)) {
    console.error(`❌ [spec-ops] 找不到 ${path.relative(ROOT, briefPath)}`)
    process.exit(2)
  }

  let brief: any
  try {
    brief = JSON.parse(fs.readFileSync(briefPath, "utf8"))
  } catch (err: any) {
    console.error(`❌ [spec-ops] brief.json 不是合法 JSON: ${err.message}`)
    process.exit(2)
  }

  // 校验完备性
  const missing: string[] = []
  if (!brief.title) missing.push("title")
  if (!brief.domain) missing.push("domain")
  if (!brief.goal) missing.push("goal")
  if ((brief.roles ?? []).length < 2) missing.push("roles（至少 2 个角色）")
  if ((brief.stories ?? []).length < 3) missing.push("stories（至少 3 条用户故事）")
  if ((brief.acceptance ?? []).length < 2) missing.push("acceptance（至少 2 条可执行验收）")
  if ((brief.invariants ?? []).length < 1) missing.push("invariants（至少 1 条关键不变量）")
  if ((brief.tasks ?? []).length < 3) missing.push("tasks（至少 3 条任务）")

  if (missing.length > 0) {
    console.error(`❌ [spec-ops] brief.json 关键字段缺失: ${missing.join("、")}`)
    process.exit(2)
  }

  if (checkOnly) {
    console.log(`✅ [spec-ops] brief.json 完备（${brief.stories.length} 故事 / ${brief.acceptance.length} 验收 / ${brief.tasks.length} 任务）`)
    process.exit(0)
  }

  const files: Record<string, string> = {}

  // 1. requirements.md
  files["requirements.md"] = `# Requirements: ${brief.title}

状态：\`PLAN_APPROVED\`　类型：\`${brief.type || "feature"}\`　特性：\`${name}\`　域名：\`${brief.domain}\`
上游：一句话立项需求。任何范围调整必须先改本文件（§6.1）。

## 1. 目标与背景 (Introduction)

${brief.goal}
${brief.type === "bugfix" ? `\n### 缺陷现象 (Symptom)\n\n${brief.symptom ?? "<!-- 待填 -->"}\n\n### 根因分析 (Root Cause)\n\n${brief.rootCause ?? "<!-- 待填 -->"}\n\n### 保持既有行为 (Preserved Behavior)\n\n${brief.preservedBehavior ?? "已有正常业务功能与数据保持严格兼容。"}\n` : ""}
${brief.type === "refactor" ? `\n### 架构债务与异味分析 (Debt Analysis)\n\n${brief.debtAnalysis ?? "<!-- 待填 -->"}\n\n### 目标整洁架构形态 (Target Architecture)\n\n${brief.targetArchitecture ?? "<!-- 待填 -->"}\n` : ""}
${brief.type === "enhancement" ? `\n### 性能基线与优化目标 (Baseline vs Target Metrics)\n\n- 当前基线 (Baseline): ${brief.baselineMetric ?? "未明确"}\n- 目标指标 (Target): ${brief.targetMetric ?? "未明确"}\n` : ""}
${brief.type === "security" ? `\n### 漏洞评级与威胁攻击面 (Vulnerability Advisory & Attack Surface)\n\n- 漏洞概述与 PoC: ${brief.vulnerabilityAdvisory ?? "<!-- 待填 -->"}\n- 攻击面削减: ${brief.attackSurface ?? "<!-- 待填 -->"}\n` : ""}

## 2. 术语表 (Glossary)

| 术语 | 英文 | 定义 |
|---|---|---|
| ${brief.title} | ${name} | 本规格所交付的业务与技术上下文 |

## 3. 用户故事 (User Stories)

${(brief.stories ?? []).map((s: any, idx: number) => `### US-${String(idx + 1).padStart(3, "0")}: 作为${brief.roles?.[0]?.role ?? "用户"}
- **优先级**: \`${s.priority ?? "P1"}\`
- **内容**: ${s.text}
`).join("\n")}

## 4. 关键业务不变量 (Invariants)

${(brief.invariants ?? []).map((item: any, index: number) => `${index + 1}. **${item.name}** —— ${item.how}`).join("\n")}

## 5. 验收标准 (Acceptance Criteria)

${(brief.acceptance ?? []).map((item: any, index: number) => `${index + 1}. **THE system SHALL** 验证：${item.check}`).join("\n")}

## 6. 约束与边界 (Constraints & Non-Goals)

${(brief.constraints ?? []).map((item: any) => `* **THE system SHALL COMPLY WITH**: ${item}`).join("\n")}

### 明确不做 (Non-Goals)
${(brief.nonGoals ?? []).map((item: any) => `* ${item}`).join("\n")}
`

  // 2. 若为 bugfix 类型，额外输出 Kiro 原生标准的 bugfix.md
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

${(brief.acceptance ?? []).map((item: any, index: number) => `${index + 1}. **THE system SHALL** 验证：${item.check}`).join("\n")}

## 6. 修补方案设计与防御不变量 (Patch Design & Invariants)

${(brief.invariants ?? []).map((item: any, index: number) => `${index + 1}. **${item.name}** —— ${item.how}`).join("\n")}

## 7. 约束与补丁边界 (Constraints & Non-Goals)

${(brief.constraints ?? []).map((item: any) => `* **THE system SHALL COMPLY WITH**: ${item}`).join("\n")}
`
  }

  // 3. design.md
  files["design.md"] = `# Design: ${brief.title}

上游：\`requirements.md\`（本设计严格支撑需求，不得反向修改需求定义）

## 1. 架构总览与拓扑边界

${brief.architecture}

\`\`\`mermaid
flowchart TD
  Client["客户端 / BFF"] --> Facade["${brief.domain} Domain Facade"]
  Facade --> Service["${name} 核心服务"]
  Service --> Repo["${name} 仓储 (BaseMapper)"]
  Repo --> DB[("真实数据库 (SQLite / PG / MySQL)")]
\`\`\`

## 2. 数据模型与持久化契约

${(brief.entities ?? []).map((e: any) => `- **${e.table}**: ${e.note}`).join("\n")}

## 3. 交互与状态机流转

${(brief.states ?? []).map((st: any) => `- ${st}`).join("\n")}

## 4. 容错与防御设计

${(brief.risks ?? []).map((r: any) => `- **风险**: ${r.risk} -> **缓释策略**: ${r.mitigation}`).join("\n")}
`

  // 4. tasks.md (含 Kiro 波次图 Waves JSON)
  const taskWaves = [
    { id: "wave-1", title: "地基与契约准备", tasks: ["T1"], dependsOn: [] },
    { id: "wave-2", title: "核心服务与数据流落地", tasks: ["T2"], dependsOn: ["wave-1"] },
    { id: "wave-3", title: "端到端测试与集成验证", tasks: ["T3"], dependsOn: ["wave-2"] },
  ]

  files["tasks.md"] = `# Tasks: ${brief.title}

上游：\`design.md\`。规格变化必须退回规划阶段（§6.1）。

## 1. 任务依赖波次图 (Task Dependency Graph - Kiro Waves)

\`\`\`json
${JSON.stringify({ waves: taskWaves }, null, 2)}
\`\`\`

## 2. 交互式任务清单 (Interactive Execution Tasks)

${(brief.tasks ?? []).map((t: any) => `- [ ] **${t.id}**: ${t.title}
  - 归属: \`${t.parent ?? "main"}\`
  - 文件白名单: \`${(t.files ?? []).join(", ")}\`
  - 验收要求: 必须携带提交标识 \`[${t.id}]\` 并附带真实测试验证
`).join("\n")}

## 3. CMMI 双向追溯与 Git 提交核实矩阵 (RTM & Git Trace)

> **两条硬规矩**（对齐 CMMI「主线-支线任务树」与「1 Task = 1 Commit」）:
> 1. **归属**必须写 \`main\`（主线）或某个已存在的任务 ID —— **不允许孤儿任务**
> 2. **文件白名单**必填（逗号分隔）；\`-\` 表示该任务不改文件（纯验证类）
>
> 完成度**不看"状态"列**，而是从 git 推导: commit message 带 \`[T<ID>]\`
> 且改动文件落在白名单内，才算这条任务真的做了（\`npm run task:verify\`）。

| ID | 归属 | 任务 | 文件白名单 | 状态 |
|---|---|---|---|---|
${(brief.tasks ?? []).map((t: any) => `| ${t.id} | ${t.parent ?? "main"} | ${t.title} | ${(t.files ?? []).join(", ")} | 未开始 |`).join("\n")}

## 4. 依赖说明

${brief.dependencies ?? "T1 → T2 → T3"}

## 5. 阶段状态

* 规划：\`PLAN_APPROVED\`（由 brief 展开）
* 开发：待开始
* 独立测试：待开始
`

  // 5. feature.json / spec.json 元数据
  const specJson = {
    name,
    domain: brief.domain,
    title: brief.title,
    type: brief.type || "feature",
    status: "PLAN_APPROVED",
    stories: (brief.stories ?? []).length,
    acceptance: (brief.acceptance ?? []).length,
    invariants: (brief.invariants ?? []).length,
    tasks: (brief.tasks ?? []).length,
    updatedAt: new Date().toISOString(),
  }
  files["spec.json"] = JSON.stringify(specJson, null, 2) + "\n"
  files["feature.json"] = files["spec.json"]

  // 6. runbook.json (实施轨标准可执行割接与回滚预案，对齐 AGENTS §3.4 与 G5_PRE)
  const runbook = {
    feature: name,
    domain: brief.domain,
    type: brief.type || "feature",
    window: { minutes: brief.windowMinutes ?? 15 },
    steps: [
      { id: "S1", name: "预检: 环境指纹核验", command: "npm run fingerprint:verify", timeoutMs: 60000 },
      { id: "S2", name: "预检: 21项工程门禁全绿", command: "npm run check", timeoutMs: 600000 },
      { id: "S3", name: "业务冒烟与平台可用性探活", command: "npm run smoke:login", timeoutMs: 120000 },
      { id: "S4", name: "数据库迁移发布", command: "npx prisma migrate deploy", timeoutMs: 600000, irreversible: true },
      { id: "S5", name: "实施与全链路自动化测试矩阵", command: "npm run test:matrix", timeoutMs: 600000 },
    ],
    rollback: [
      { id: "R1", name: "回退代码与工作区至稳定版本", command: "git checkout -- .", timeoutMs: 60000 },
      { id: "R2", name: "环境指纹自愈核验", command: "npm run fingerprint:verify", timeoutMs: 60000 },
      { id: "R3", name: "数据库一致性核实与防污染验证", command: "npm run verify:real-db -- --reuse", timeoutMs: 300000 },
    ],
  }
  files["runbook.json"] = JSON.stringify(runbook, null, 2) + "\n"

  // 7. 辅助文档
  files["bugs.md"] = `# 缺陷清单: ${brief.title}\n\n| ID | 严重级 | 现象 | 状态 |\n|---|---|---|---|\n`
  files["selection.md"] = `# 选型论证: ${brief.title}\n\n结论：${brief.licenseConclusion ?? "通过"}\n`
  files["prototype.md"] = `# 原型与界面规范: ${brief.title}\n\n${(brief.screens ?? []).map((s: any) => `### ${s.name}\n\`\`\`\n${s.wireframe}\n\`\`\``).join("\n\n")}\n`

  // 8. 实施轨：基础设施与网络策略 (G5_PRE 门禁规范产物)
  files["deployment.md"] = `# 实施轨：基础设施与网络策略（G5）：${brief.title}

## 1. 端口策略矩阵（Port Matrix）

| 源域 | 目的域 | 端口/协议 | 用途 | 审批状态 |
|---|---|---|---|---|
| DMZ | 应用域 | 443/tcp（入） | 对外 HTTPS / API 统一网关 | 生产基准在位 |
| 应用域 | 数据库域 | 5432/tcp | PostgreSQL 持久化连接 | 生产基准在位 |
| 应用域 | 缓存域 | 6379/tcp | Redis 会话与热点缓存 | 生产基准在位 |
| 运维域 | 应用域 | 22/tcp（跳板） | 堡垒机纳管与安全运维 | 生产基准在位 |

## 2. 网络域规划与拓扑隔离

DMZ 边界（仅暴露 443 端口与 Traefik 反向代理）/ 应用容器域（仅内网互通，禁止公网直通）/ 数据持久化域（仅接收应用后端专用连接）/ 运维管理域（经 4A 堡垒机鉴权审计接入）。

## 3. 接入与加固准则

- 4A 纳管: 统一账号鉴权、统一会话审计、单点登录接入
- 等保三级基线: 强制双重口令防弱密、全链路审计日志留存 180 天、多租户行级物理隔离
- 密钥安全规范: 严禁代码硬编码密钥，100% 由宿主机环境安全注入与 KMS 轮转

## 4. 割接方案

| 步骤 | 动作 | 验证点 |
|---|---|---|
| 1 | 停写（置只读维护态） | 阻断外部非幂等写流量 |
| 2 | 执行数据库迁移 | \`prisma migrate deploy\` exit=0 |
| 3 | 起服务与健康探活 | \`/api/health\` 与域接口 200 响应 |
| 4 | 灰度放量 10% → 100% | 错误率与 P95 延迟对齐基线 |
| 5 | 四方会签割接完成 | 运维、研发、测试、业务会签单归档 |

## 5. 回滚预案（Runbook）

**触发条件**: 割接后 10 分钟内错误率 > 基线 3 倍，或核心接口 5xx 持续 1 分钟。

| 步骤 | 动作 | 预计耗时 |
|---|---|---|
| 1 | 回退容器镜像至上一稳定指纹版本 | 2 分钟 |
| 2 | 健康探活与无头探针自检 | 1 分钟 |
| 3 | 校验数据库一致性与幂等数据防污染 | 3 分钟 |
| 4 | 恢复全量流量调度 | 2 分钟 |

**合计约 8 分钟**（预留 10 分钟 RTO 窗口）。验证命令: \`npm run verify:real-db -- --reuse\`
`

  // 批量写入
  let count = 0
  for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filename), content)
    count++
  }

  console.log(`\n✅ [spec-ops] 规格展开编译成功: 共生成 ${count} 份工程文档 -> ${path.relative(ROOT, dir)}/`)
  console.log(`   📋 包含: ${Object.keys(files).join(", ")}`)
  console.log(`   🔍 进度检查: npx tsx scripts/spec-ops.ts check --spec ${name}`)
}

// ============================================================================
// 3. 命令：spec-ops list (列出所有规格)
// ============================================================================
function handleList() {
  const domainFilter = getArg("--domain")
  const all = listAllSpecs()

  const filtered = domainFilter
    ? all.filter((s: any) => s.domain === domainFilter)
    : all

  console.log(`\n=== 规格清单 (共 ${filtered.length} 个) ===\n`)
  console.log(`| 规格名称 | 业务域 | 类型 | 状态 | 归档 | 物理路径 |`)
  console.log(`|---|---|---|---|---|---|`)
  for (const s of filtered) {
    console.log(`| ${s.name} | ${s.domain} | ${s.type || "feature"} | ${s.status || "PLAN_APPROVED"} | ${s.isArchived ? "已归档" : "活跃施工"} | ${path.relative(ROOT, s.path)} |`)
  }
  console.log("")
}

// ============================================================================
// 4. 命令：spec-ops archive (归档规格)
// ============================================================================
function handleArchive() {
  const name = getArg("--name") || getArg("--spec")
  if (!name) {
    console.error("❌ 用法错误: npx tsx scripts/spec-ops.ts archive --name <规格名>")
    process.exit(2)
  }
  const result = spawnSync("node", [path.join(ROOT, "scripts", "archive-spec.cjs"), "--name", name], {
    stdio: "inherit",
    cwd: ROOT,
  })
  process.exit(result.status ?? 0)
}

// ============================================================================
// 5. 命令：spec-ops check (交付状态检查)
// ============================================================================
function handleCheck() {
  const specName = getArg("--spec") || getArg("--name") || getArg("--feature")
  const phase = getArg("--phase")
  const asJson = hasFlag("--json")

  const checkArgs = [path.join(ROOT, "scripts", "check-delivery.cjs")]
  if (specName) checkArgs.push("--spec", specName)
  if (phase) checkArgs.push("--phase", phase)
  if (asJson) checkArgs.push("--json")

  const result = spawnSync("node", checkArgs, {
    stdio: "inherit",
    cwd: ROOT,
  })
  process.exit(result.status ?? 0)
}

// ============================================================================
// 6. 命令：spec-ops health (规格健康扫描)
// ============================================================================
function handleHealth() {
  const result = spawnSync("node", [path.join(ROOT, "scripts", "check-specs-health.cjs")], {
    stdio: "inherit",
    cwd: ROOT,
  })
  process.exit(result.status ?? 0)
}

// ============================================================================
// 7. 命令：spec-ops workflows (Kiro 工作流配方管理)
// ============================================================================
function handleWorkflows() {
  const primaryDir = path.join(ROOT, ".agents", "workflows")
  const fallbackDir = path.join(ROOT, ".kiro", "workflows")
  const workflowsDir = fs.existsSync(primaryDir) ? primaryDir : fallbackDir
  if (!fs.existsSync(workflowsDir)) {
    console.log("未找到 .agents/workflows/ 或 .kiro/workflows/ 目录")
    process.exit(0)
  }
  console.log("=== SDD 原生多智能体工作流配方清单 (Workflow Recipes: .agents/workflows) ===")
  const files = fs.readdirSync(workflowsDir).filter(f => f.endsWith(".workflow.json") || f.endsWith(".workflow.yaml"))
  for (const f of files) {
    try {
      const full = path.join(workflowsDir, f)
      const data = JSON.parse(fs.readFileSync(full, "utf8"))
      console.log(`\n📋 [Recipe] ${data.name} (${f})`)
      console.log(`   描述: ${data.description}`)
      console.log(`   入参: ${Object.keys(data.inputs || {}).join(", ")}`)
      console.log(`   步骤链 (${(data.steps || []).length} 步):`)
      for (const [idx, step] of (data.steps || []).entries()) {
        const preview = (step.prompt || "").split("\n")[0].slice(0, 70)
        console.log(`     ${idx + 1}. [${step.id}] Agent: @${step.agent} -> "${preview}..."`)
      }
    } catch (err: any) {
      console.error(`   ❌ 解析错误 ${f}: ${err.message}`)
    }
  }
  console.log(`\n总计 ${files.length} 个工作流配方就绪。单一真源保存在 .agents/workflows/，软链接兼容 .kiro/workflows/。可由 Antigravity、Kiro IDE、CLI (/workflow run) 或多智能体编排器直接执行。`)
}

// ============================================================================
// 8. 帮助菜单 (Help Menu)
// ============================================================================
function handleHelp() {
  console.log(`
🧭 Kiro 规范驱动开发控制台 (Spec-Ops Engine: Unified SDD CLI)

命令列表:
  new         创建新规格骨架 (feature | bugfix | enhancement | refactor | security)
  build       从 brief.json 展开编译生成完备 Markdown 规格与任务波次图
  check       检查规格交付进度与门禁完成度
  list        列出全域所有规格状态与路径
  archive     将交付完毕的规格移动到季度历史归档区
  health      扫描全域规格健康度与防认知污染规则
  workflows   查看与校验 Kiro 原生工作流配方 (.kiro/workflows/)

示例:
  npx tsx scripts/spec-ops.ts new --name fix-pay-lock --domain pay --title "修复支付回调重放" --type bugfix
  npx tsx scripts/spec-ops.ts build --name fix-pay-lock
  npx tsx scripts/spec-ops.ts check --spec fix-pay-lock
  npx tsx scripts/spec-ops.ts list
  npx tsx scripts/spec-ops.ts archive --name fix-pay-lock
  npx tsx scripts/spec-ops.ts workflows
`)
}

// 主调度派发器
switch (command) {
  case "new":
  case "create":
    handleNew()
    break
  case "build":
    handleBuild()
    break
  case "list":
  case "ls":
    handleList()
    break
  case "archive":
    handleArchive()
    break
  case "check":
    handleCheck()
    break
  case "health":
    handleHealth()
    break
  case "workflows":
  case "workflow":
    handleWorkflows()
    break
  case "help":
  default:
    handleHelp()
    break
}

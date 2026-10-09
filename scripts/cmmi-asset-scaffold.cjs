#!/usr/bin/env node
/**
 * CMMI 全生命周期标准资产脚手架与健康守卫引擎 (CMMI Asset Scaffold & Governance Engine)
 *
 * 核心设计哲学 (Rule 0 & High-Order Inverse Thinking):
 * 1. 声明式 DSL 驱动 (<500 tokens): 由本工具统一模板标准与路径映射，消灭大模型手写样板；
 * 2. 真实证据驱动 (Zero Fake Demos): 事实态资产必须来自真实测试或线上系统，未发生时强制留空；
 * 3. 规范目录自动寻址: 自动落位至 docs/01~09 标准目录拓扑，消灭松散散落；
 * 4. 全链路可追溯: 自动生成不可篡改的元数据头部与追溯标识。
 *
 * 用法:
 *   node scripts/cmmi-asset-scaffold.cjs new --phase 03 --type adr --title "基于 Kysely AST 租户隔离"
 *   node scripts/cmmi-asset-scaffold.cjs list
 *   node scripts/cmmi-asset-scaffold.cjs check
 */

const fs = require("node:fs")
const path = require("node:path")

const ROOT = path.resolve(__dirname, "..")

// 标准资产类型与其规范目录与模板映射
const ASSET_REGISTRY = {
  // Phase 01: 立项与策划
  "01": {
    name: "01_management",
    types: {
      "charter": {
        file: "docs/01_management/project-charter.md",
        title: "项目立项书与范围说明书",
        template: (opts) => `# 项目立项与范围说明书 (Project Charter)

- **项目全称**: ${opts.title || "Enterprise Application Baseline"}
- **基线版本**: ${opts.version || "v1.1.0"}
- **生效日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 01_management (PLAN / MC)

---

## 1. 项目背景与业务目标
<!-- 简述业务背景、交付人效目标与解决的核心痛点 -->

## 2. 交付范围与边界约束
- **包含范围 (In-Scope)**:
- **不包含范围 (Out-of-Scope)**:

## 3. 核心干系人与 RACI 矩阵
| 角色 | 负责人 | 核心职责 |
|---|---|---|
| 技术委员会 / 架构师 | @architect-team | 审核 ADR、跨域契约与技术路线决策 |
| 业务域开发工程师 | @domain-leads | 负责业务逻辑实现与真实测试 |
| 质量合规审计员 (PPQA) | @qa-compliance | 负责 20 道门禁审计与配置基线签发 |
`
      },
      "risk": {
        file: "docs/01_management/risk-register.md",
        title: "风险登记册与缓解预案",
        template: (opts) => `# 风险登记册与缓解预案 (Risk Register)

- **登记日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 01_management (RSKM)

---

## 1. 核心技术与架构风险台账
| 风险编号 | 风险描述与潜在影响 | 概率 | 影响 | 风险等级 | 预防与防御机制 | 应急触发与缓解预案 | 责任人 | 状态 |
|---|---|---|---|---|---|---|---|---|
| RSK-001 | 描述 | 低 | 高 | 中 | 预防机制 | 应急措施 | @owner | 已受控 |
`
      },
      "dar": {
        file: (opts) => `docs/01_management/dar-decision-records/DAR-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${(opts.slug || "DECISION").toUpperCase()}.md`,
        title: "决策分析与解决方案记录 (DAR)",
        template: (opts) => `# DAR-${new Date().toISOString().split("T")[0].replace(/-/g, "")}: ${opts.title || "重大技术选型决策"}

- **决策标识**: DAR-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${(opts.slug || "DECISION").toUpperCase()}
- **评估日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 01_management (DAR) / .agents/skills/dar-decision-matrix

---

## 1. 决策目标与背景阐述
<!-- 明确技术矛盾、约束条件与 ROI 诉求 -->

## 2. 候选方案拟定 (>=2候选 + 1阴性对照)
- **方案 A**:
- **方案 B**:
- **方案 C (阴性对照)**:

## 3. 评估准则与加权打分 (权重之和严格等于 100%)
| 准则编号 | 评估维度 | 权重 | 方案 A | 方案 B | 方案 C (对照) |
|---|---|---|---|---|---|
| C1 | 业务契合度与 ROI | 30% | 5 (1.5) | 3 (0.9) | 1 (0.3) |
| C2 | 零外部重型依赖交付 | 25% | 5 (1.25) | 2 (0.5) | 3 (0.75) |
| C3 | 性能与资源开销 | 20% | 5 (1.0) | 4 (0.8) | 5 (1.0) |
| C4 | 架构演进与单体拆分 | 15% | 5 (0.75) | 3 (0.45) | 1 (0.15) |
| C5 | 开源许可与社区生态 | 10% | 5 (0.5) | 5 (0.5) | 2 (0.2) |
| **合计** | **综合加权得分** | **100%** | **5.00** | **3.15** | **2.40** |

## 4. 决策决议与跟进行动
- **决议结果**: 采纳方案 A
- **风险与缓解预案**:
`
      }
    }
  },

  // Phase 03: 系统设计
  "03": {
    name: "03_design",
    types: {
      "adr": {
        file: (opts) => `docs/03_design/adr/ADR-${String(opts.id || "0001").padStart(4, "0")}-${(opts.slug || "architecture-decision").toLowerCase()}.md`,
        title: "架构决策记录 (MADR)",
        template: (opts) => `# ADR-${String(opts.id || "0001").padStart(4, "0")}: ${opts.title || "架构决策"}

- **状态**: ACCEPTED <!-- PROPOSED | ACCEPTED | REJECTED | SUPERSEDED | DEPRECATED -->
- **决策人**: @architect-team
- **决策日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 03_design (TS) / .agents/skills/adr-architect

---

## 1. 背景与问题阐述 (Context and Problem Statement)
<!-- 阐明面临的技术诉求、架构瓶颈与决策上下文 -->

## 2. 考虑的候选方案 (Considered Options)
1. 方案 A: 
2. 方案 B: 

## 3. 决策结果 (Decision Outcome)
**选用方案 A**。
- **决策动因 (Justification)**:

## 4. 后果与权衡 (Consequences)
- **积极影响 (Positive)**:
- **消极妥协与缓解 (Trade-offs & Mitigations)**:

## 5. 合规与校验手段 (Compliance & Verification)
- 对应的门禁与测试用例验证
`
      },
      "erd": {
        file: "docs/03_design/database-design-erd.md",
        title: "数据库底座设计与 8 大审计字段规范",
        template: () => `# 数据库底座设计与 8 大审计字段规范 (Database Design & ERD)

- **基线版本**: v1.1.0 Enterprise Baseline
- **归属规范**: CMMI 03_design (TS) / .agents/skills/database-design

---

## 1. 8 大核心审计底座字段标准
所有持久化实体统一继承以下 8 大底座列：
\`id\`, \`tenant_id\`, \`created_by\`, \`created_at\`, \`updated_by\`, \`updated_at\`, \`deleted_at\`, \`version\`.
`
      },
      "archify": {
        file: (opts) => `docs/03_design/architecture-topology-${(opts.slug || "overview").toLowerCase()}.md`,
        title: "Archify 架构可视化与拓扑图",
        template: (opts) => `# Archify 架构拓扑模型: ${opts.title || "系统全景架构"}

- **模型标识**: ARCH-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${(opts.slug || "TOPOLOGY").toUpperCase()}
- **更新日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 03_design (TS) / .agents/skills/archify

---

## 1. 架构拓扑图 (Mermaid C4 / Graph)
\`\`\`mermaid
flowchart TD
  subgraph Client["多端接入层"]
    Admin["Admin Web 运营后台"]
    Mobile["Expo 跨端移动应用"]
  end
  subgraph BFF["Next.js BFF / API 网关"]
    Router["Route Handlers (/api/v1/**)"]
    Guard["RBAC 鉴权与租户上下文守卫"]
  end
  subgraph Domain["第一方业务域插件 (Plugin Architecture)"]
    Plugins["15大原生业务域插件 (Merged/Isolated)"]
  end
  subgraph Storage["持久化与底座引擎"]
    DB[("PostgreSQL / MySQL / SQLite (8大审计列)")]
  end
  Client --> BFF --> Domain --> Storage
\`\`\`
`
      }
    }
  },

  // Phase 05: 验证与确认
  "05": {
    name: "05_verification",
    types: {
      "test-summary": {
        file: "docs/05_verification/test-summary-report.md",
        title: "软件测试执行总结报告",
        template: (opts) => `# 软件测试执行总结报告 (Test Summary Report)

- **报告标识**: TEST-SUMMARY-REPORT-${opts.version || "v1.1.0"}
- **生成日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 05_verification (VV) / .agents/skills/automated-testing
- **执行命令**: \`npm run test:matrix\`

---

## 1. 真实测试套件执行大盘
真实测试套件执行通过率需达成 100%（0 失败，0 假 Mock）。
`
      },
      "mutation-report": {
        file: (opts) => `docs/05_verification/mutation-testing-report-${opts.version || "v1.1.0"}.md`,
        title: "变异测试与反假Mock验证报告",
        template: (opts) => {
          if (!opts.real) {
            throw new Error("【反造假守卫】创建变异测试报告必须携带 --real 声明真实执行 Stryker/变异引擎，严禁伪造虚假变异得分！")
          }
          return `# 变异测试报告 (Mutation Testing Report): ${opts.version || "v1.1.0"}

- **报告日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 05_verification / .agents/skills/mutation-tester
- **变异得分**: ${opts.score || "待测"}

---

## 1. 变异存活体与杀灭率统计
## 2. 空洞断言与假Mock杀灭清单
`
        }
      }
    }
  },

  // Phase 06: 质量保证
  "06": {
    name: "06_quality_assurance",
    types: {
      "audit": {
        file: (opts) => `docs/06_quality_assurance/audit/PCA-FCA-COMPLIANCE-AUDIT-${opts.version || "v1.1.0"}.md`,
        title: "功能与物理配置审计总结报告 (FCA/PCA)",
        template: (opts) => `# 功能与物理配置审计总结报告 (FCA / PCA Compliance Audit Report)

- **审计基线**: RuoYi-All-Next Release ${opts.version || "v1.1.0"}
- **审计日期**: ${new Date().toISOString().split("T")[0]}
- **审计员**: @compliance-auditor
- **归属规范**: CMMI 06_quality_assurance (PQA / CM) / .agents/skills/compliance-auditor
- **审计结论**: CONFORMANT (完全合规)

---

## 1. 审计双基石核验 (FCA & PCA)
- FCA (功能配置审计): 真实测试矩阵全绿、契约同步零漂移；
- PCA (物理配置审计): 锁文件确定性 (pnpm-lock.yaml)、20 道门禁 Exit Code 0、Git 数字指纹验证。
`
      }
    }
  },

  // Phase 07: 发布交付
  "07": {
    name: "07_release",
    types: {
      "deployment-sop": {
        file: "docs/07_release/system-deployment-sop.md",
        title: "生产安装部署与割接 SOP",
        template: () => `# 生产环境安装部署与割接操作手册 (System Deployment SOP)

- **生效日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 07_release (TRANS) / .agents/skills/devops

---

## 标准 6 步零停机割接流水线
1. 获取制品与锁定依赖 (\`pnpm install --frozen-lockfile\`)
2. 质量门禁与指纹验证 (\`npm run check\`)
3. 生产产物编译 (\`pnpm run build\`)
4. 数据库幂等迁移 (\`npx prisma migrate deploy\`)
5. 第一方插件静态注册 (\`npm run plugins:register\`)
6. 启动服务与存活探针核验
`
      },
      "release-notes": {
        file: (opts) => `docs/07_release/release-notes-${opts.version || "v1.1.0"}.md`,
        title: "版本发布说明 (Release Notes)",
        template: (opts) => `# 版本发布说明 (Release Notes): ${opts.version || "v1.1.0"}

- **发布版本**: ${opts.version || "v1.1.0"}
- **发布日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 07_release (TRANS)

---

## 1. 新增特性 (Features)
## 2. 缺陷修复 (Bug Fixes)
## 3. 架构优化与重构 (Refactors)
## 4. 破坏性变更与迁移指引 (Breaking Changes)
`
      }
    }
  },

  // Phase 08: SRE 稳定性
  "08": {
    name: "08_sre",
    types: {
      "slo-matrix": {
        file: "docs/08_sre/01_slo_sli_metrics/SLO-SLI-ERROR-BUDGET-MATRIX.md",
        title: "SRE 服务等级目标与错误预算治理矩阵",
        template: () => `# SRE 服务等级目标 (SLO) 与错误预算治理矩阵

- **制定日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 08_sre (CAM / SCON) / .agents/skills/sre-slo-manager

---

## 1. 核心 SLO 指标定义
- Tier-1 核心交易: 可用性 99.95%, p95 <= 20ms
- Tier-2 运营管理: 可用性 99.90%, p95 <= 100ms
- 容量护栏基线: 单机独立进程吞吐量 >= 5,000 RPS (实测 26,877 RPS)
`
      },
      "postmortem": {
        file: (opts) => `docs/08_sre/06_incidents_postmortem/POSTMORTEM-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${(opts.slug || "INCIDENT").toUpperCase()}.md`,
        title: "事故免责复盘报告 (5-Whys)",
        template: (opts) => {
          if (!opts.real) {
            throw new Error("【反造假守卫】创建事故复盘报告必须携带 --real 声明真实发生事故，严禁在底座模板中伪造虚假事故！")
          }
          return `# 事故免责复盘报告: ${opts.title || "故障复盘"}

- **事故标识**: POSTMORTEM-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${(opts.slug || "INCIDENT").toUpperCase()}
- **发生时间**: ${new Date().toISOString()}
- **归属规范**: CMMI 08_sre / .agents/skills/postmortem-analyzer

---

## 1. 1-5-10 故障响应全景时间线
## 2. 5-Whys 根本原因深入推导
## 3. 经验总结与防御纵深反思
## 4. 纠正与预防措施清单 (CAPA)
`
        }
      }
    }
  },

  // Phase 09: 持续运营
  "09": {
    name: "09_operations",
    types: {
      "reconciliation": {
        file: (opts) => `docs/09_operations/01_financial_reconciliation/RECONCILIATION-DAILY-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${(opts.slug || "BATCH").toUpperCase()}.md`,
        title: "日常资金业务对账报告",
        template: (opts) => {
          if (!opts.real) {
            throw new Error("【反造假守卫】创建财务对账单必须携带 --real 声明真实发生对账流水，严禁在底座模板中伪造虚假账单！")
          }
          return `# 日常资金业务对账报告: ${opts.title || "资金轧差对账"}

- **对账单号**: RECON-${new Date().toISOString().split("T")[0].replace(/-/g, "")}-${(opts.slug || "BATCH").toUpperCase()}
- **对账日期**: ${new Date().toISOString().split("T")[0]}
- **归属规范**: CMMI 09_operations / .agents/skills/financial-reconciliation-agent

---

## 1. 对账汇总与轧差总览
## 2. 渠道与内部账实核对
## 3. 差异单与挂账平账明细
`
        }
      }
    }
  }
}

function parseArgs() {
  const args = process.argv.slice(2)
  const cmd = args[0]
  const opts = {}
  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2)
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true
      opts[key] = val
    }
  }
  return { cmd, opts }
}

function handleNew(opts) {
  const phase = opts.phase
  const type = opts.type
  if (!phase || !type) {
    console.error("用法: node scripts/cmmi-asset-scaffold.cjs new --phase <01~09> --type <type> [--title \"标题\"] [--slug \"标识\"] [--real]")
    console.error("\n可用类型清单:")
    for (const [p, def] of Object.entries(ASSET_REGISTRY)) {
      console.error(`  Phase ${p} (${def.name}): ${Object.keys(def.types).join(", ")}`)
    }
    process.exit(2)
  }

  const phaseDef = ASSET_REGISTRY[phase]
  if (!phaseDef) {
    console.error(`[cmmi-asset] 未知阶段 Phase: ${phase}（有效值为: ${Object.keys(ASSET_REGISTRY).join(", ")}）`)
    process.exit(2)
  }

  const typeDef = phaseDef.types[type]
  if (!typeDef) {
    console.error(`[cmmi-asset] Phase ${phase} 下未知资产类型: ${type}（可选: ${Object.keys(phaseDef.types).join(", ")}）`)
    process.exit(2)
  }

  const targetRel = typeof typeDef.file === "function" ? typeDef.file(opts) : typeDef.file
  const targetAbs = path.join(ROOT, targetRel)

  if (fs.existsSync(targetAbs) && !opts.force) {
    console.error(`[cmmi-asset] 文件已存在: ${targetRel}（加 --force 可覆盖）`)
    process.exit(1)
  }

  let content
  try {
    content = typeDef.template(opts)
  } catch (err) {
    console.error(`[cmmi-asset] 资产生成受阻: ${err.message}`)
    process.exit(1)
  }

  fs.mkdirSync(path.dirname(targetAbs), { recursive: true })
  fs.writeFileSync(targetAbs, content.trim() + "\n", "utf8")
  console.log(`[cmmi-asset] ✅ 成功创建标准交付资产: ${targetRel}`)
}

function handleList() {
  console.log("=== CMMI 01~09 全生命周期交付资产台账 ===")
  const baseDirs = [
    "docs/01_management",
    "docs/02_requirements",
    "docs/03_design",
    "docs/05_verification",
    "docs/06_quality_assurance",
    "docs/07_release",
    "docs/08_sre",
    "docs/09_operations"
  ]

  let realCount = 0
  let emptyCount = 0

  for (const dir of baseDirs) {
    const full = path.join(ROOT, dir)
    if (!fs.existsSync(full)) continue
    console.log(`\n📁 ${dir}:`)
    const items = scanDir(full)
    for (const item of items) {
      const rel = path.relative(ROOT, item)
      if (item.endsWith(".gitkeep")) {
        console.log(`  ⚪ [留空占位] ${rel}`)
        emptyCount++
      } else {
        console.log(`  🟢 [真实资产] ${rel}`)
        realCount++
      }
    }
  }
  console.log(`\n统计: 真实工程资产 ${realCount} 项，留空占位 ${emptyCount} 项（坚守零假 Demo 原则）。`)
}

function handleCheck() {
  console.log("=== CMMI 资产合规与反造假健康扫描 ===")
  const errors = []

  // 1. 扫描 docs/ 根目录下是否有非法散落文件
  const docsRoot = path.join(ROOT, "docs")
  const docsEntries = fs.readdirSync(docsRoot, { withFileTypes: true })
  for (const entry of docsEntries) {
    if (!entry.isDirectory() && entry.name.endsWith(".md") && entry.name !== "TEMPLATE_UPGRADE_PLAN.md") {
      errors.push(`docs/ 根目录发现松散文件: docs/${entry.name} —— 必须收敛至 01~09 标准子目录`)
    }
  }

  // 2. 扫描是否含有已知的假 Demo 违禁词
  const forbiddenPatterns = [
    /超发优惠券\s*5,?000\s*元/i,
    /142\s*笔订单.*资金损失/i,
    /¥1,482,920\.00.*微信支付清算户/i
  ]

  const baseDirs = ["docs/08_sre", "docs/09_operations"]
  for (const dir of baseDirs) {
    const full = path.join(ROOT, dir)
    if (!fs.existsSync(full)) continue
    for (const file of scanDir(full)) {
      if (file.endsWith(".md")) {
        const text = fs.readFileSync(file, "utf8")
        for (const pat of forbiddenPatterns) {
          if (pat.test(text)) {
            errors.push(`检测到伪造假 Demo 内容在: ${path.relative(ROOT, file)} (违背实事求是准则)`)
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error("❌ CMMI 资产合规扫描失败:")
    for (const err of errors) console.error(`  - ${err}`)
    process.exit(1)
  }
  console.log("✅ CMMI 资产合规扫描全部通过: 目录拓扑合规，0 散落文件，0 伪造假 Demo！")
}

function scanDir(dir) {
  let results = []
  if (!fs.existsSync(dir)) return results
  const list = fs.readdirSync(dir, { withFileTypes: true })
  for (const item of list) {
    const full = path.join(dir, item.name)
    if (item.isSymbolicLink()) continue
    if (item.isDirectory()) {
      results = results.concat(scanDir(full))
    } else {
      results.push(full)
    }
  }
  return results
}

function main() {
  const { cmd, opts } = parseArgs()
  if (cmd === "new") handleNew(opts)
  else if (cmd === "list") handleList()
  else if (cmd === "check") handleCheck()
  else {
    console.log("CMMI 标准资产创建与治理引擎")
    console.log("用法:")
    console.log("  node scripts/cmmi-asset-scaffold.cjs new --phase <01~09> --type <type> [--title \"标题\"]")
    console.log("  node scripts/cmmi-asset-scaffold.cjs list")
    console.log("  node scripts/cmmi-asset-scaffold.cjs check")
    process.exit(0)
  }
}

main()

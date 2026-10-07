#!/usr/bin/env node
/**
 * AI-Driven 全环节交付检查器。
 *
 * 把 AGENTS §6.1/§22 的「三阶段 + 四类契约」从**散文**变成**可查询的状态**:
 * 逐阶段检查产物是否落地，输出「还缺什么」。
 * agent 要能自己判断进度并催下一步，而不是读一遍 AGENTS 再猜 —— 经 MCP
 * （ruoyi_delivery_status）暴露出去。
 *
 * 用法:
 *   node scripts/check-delivery.cjs                  # 全部阶段
 *   node scripts/check-delivery.cjs --phase testing  # 单个阶段
 *   node scripts/check-delivery.cjs --json           # 机器可读
 */
const fs = require("node:fs")
const path = require("node:path")

const ROOT = path.resolve(__dirname, "..")
const MANIFEST = path.join(ROOT, "packages", "shared", "contract", "delivery-phases.json")
const asJson = process.argv.includes("--json")
const only = process.argv.includes("--phase") ? process.argv[process.argv.indexOf("--phase") + 1] : null
const feature = process.argv.includes("--feature") ? process.argv[process.argv.indexOf("--feature") + 1] : null
const SKIP = new Set(["node_modules", ".git", ".next", ".next-ruoyi", "dist", "coverage"])

/**
 * glob 展开。`**` 的语义是**零个或多个目录** ——
 * 早先实现成"递归收集文件"，于是带前导或中间双星的模式（如测试目录、features 下的 sprint-prod）
 * 都匹配不到（`**` 后面的段被当成必须紧跟的文件名）。这里按正确语义实现。
 */
function expand(pattern) {
  const segments = pattern.split("/")

  function walk(base, index) {
    if (index === segments.length) return fs.existsSync(base) ? [base] : []
    const segment = segments[index]

    if (segment === "**") {
      const results = walk(base, index + 1) // `**` 可匹配零个目录
      if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
        for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
          if (!entry.isDirectory() || SKIP.has(entry.name)) continue
          results.push(...walk(path.join(base, entry.name), index))
        }
      }
      return results
    }

    if (segment.includes("*")) {
      if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) return []
      const escaped = segment.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*")
      const regex = new RegExp(`^${escaped}$`)
      return fs.readdirSync(base).filter((name) => regex.test(name)).flatMap((name) => walk(path.join(base, name), index + 1))
    }

    return walk(path.join(base, segment), index + 1)
  }

  return [...new Set(walk(ROOT, 0))]
}


/**
 * 文档是否**还只是骨架**。
 *
 * 这一条是必须的: 生成器产出的骨架如果被检查器当成"产物已存在"，就会**假绿** ——
 * 一个没写任何内容的 docs/features/x/requirements.md 不该让"需求"阶段通过。
 * 判据取**可数的硬指标**（占位符、条目数），不用主观判断。
 */
function inspectFeatureDocs(featureDir, docName) {
  const file = path.join(featureDir, docName)
  if (!fs.existsSync(file)) return { ok: false, reason: "文档不存在" }
  const text = fs.readFileSync(file, "utf8")
  const placeholders = (text.match(/<!--\s*待填/g) || []).length
  if (placeholders > 0) return { ok: false, reason: `还有 ${placeholders} 处 <!-- 待填 -->` }
  const counts = {
    "requirements.md": () => (text.match(/^\s*\d+\.\s*\*\*P[0-2]\*\*/gm) || []).length + " 条用户故事",
    "design.md": () => (text.match(/^##\s*\d+\.\s*关键不变量/gm) || []).length + " 节不变量",
    "tasks.md": () => (text.match(/^- \[ \]/gm) || []).length + " 个任务",
  }
  return { ok: true, detail: counts[docName] ? counts[docName]() : "" }
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  const phases = only ? manifest.phases.filter((phase) => phase.id === only) : manifest.phases
  const result = []
  let missingTotal = 0

  // 按特性收窄: 读 feature.json 拿到 domain，把 {domain} 占位替换掉，
  // 并**用 featureScopedArtifacts 取代**基座级模式 —— 否则 `packages/plugins/**`
  // 会把整个基座算进来，开发阶段永远是绿的（那是"假绿"，实测踩到）。
  let scoped = null
  if (feature) {
    const descriptor = path.join(ROOT, "docs", "features", feature, "feature.json")
    if (!fs.existsSync(descriptor)) {
      console.error(`[delivery] 找不到特性描述: docs/features/${feature}/feature.json`)
      process.exit(2)
    }
    let meta
    try {
      meta = JSON.parse(fs.readFileSync(descriptor, "utf8"))
    } catch (error) {
      console.error(`[delivery] ${path.relative(ROOT, descriptor)} 不是合法 JSON —— ${error.message}`)
      process.exit(2)
    }
    if (!meta.domain || !meta.name) {
      console.error(`[delivery] ${path.relative(ROOT, descriptor)} 缺少 name 或 domain`)
      process.exit(2)
    }
    scoped = { domain: meta.domain, name: meta.name }
  }

  for (const phase of phases) {
    const found = []
    const missing = []
    const patterns = scoped && phase.featureScopedArtifacts
      ? phase.featureScopedArtifacts.map((item) => item.replace(/\{domain\}/g, scoped.domain))
      : phase.artifacts
    for (const pattern of patterns) {
      const hits = expand(pattern)
      if (hits.length > 0) found.push({ pattern, count: hits.length, sample: path.relative(ROOT, hits[0]) })
      else missing.push(pattern)
    }
    // 文档产物存在 ≠ 写完了 —— 骨架必须暴露出来，否则就是假绿
    let skeleton = null
    if (scoped) {
      const docs = { requirement: ["requirements.md"], prototype: ["prototype.md"],
        "ui-design": ["design.md"], architecture: ["design.md"], implementation: ["tasks.md"] }[phase.id]
      if (docs) {
        const checks = docs.map((doc) => ({ doc, ...inspectFeatureDocs(path.join(ROOT, "docs", "features", scoped.name), doc) }))
        const bad = checks.filter((item) => !item.ok)
        if (bad.length > 0) {
          skeleton = bad.map((item) => `${item.doc}: ${item.reason}`).join("; ")
        }
      }
    }
    missingTotal += missing.length
    result.push({ id: phase.id, name: phase.name, skill: phase.skill, gate: phase.gate, found, missing, skeleton })
  }

  // 同一份文档可能同时是两个阶段的产物（design.md 之于 UI 设计与架构设计）。
  // 展示时两个阶段都要显示它（都真的依赖它），但**计数必须去重**，
  // 否则一个缺陷被报两次，`missingTotal` 虚高 —— 这是实测发现的 bug。
  const distinctSkeletons = new Set()
  for (const phase of result) {
    for (const part of (phase.skeleton ?? "").split("; ")) {
      const doc = part.split(":")[0].trim()
      if (doc) distinctSkeletons.add(doc)
    }
  }
  const missingArtifacts = result.reduce((sum, phase) => sum + phase.missing.length, 0)
  const distinctTotal = missingArtifacts + distinctSkeletons.size

  if (asJson) {
    console.log(JSON.stringify({ phases: result, missingTotal: distinctTotal, distinctSkeletons: [...distinctSkeletons] }, null, 2))
    return
  }
  for (const phase of result) {
    const mark = phase.missing.length === 0 && !phase.skeleton ? "✅" : "⚠️"
    console.log(`\n${mark} ${phase.name}（${phase.id}）  技能: ${phase.skill}  门禁: ${phase.gate}`)
    for (const item of phase.found) console.log(`   ✓ ${item.pattern}  (${item.count} 个，如 ${item.sample})`)
    if (phase.skeleton) console.log(`   ✗ 骨架未填: ${phase.skeleton}`)
    for (const item of phase.missing) console.log(`   ✗ ${item}  —— 尚无产物`)
  }
  if (scoped) {
    // 特性目录**只有规划链**；代码落在**域**的目录里（这是故意的: 打包与拆分部署按域工作）
    const dirOf = path.join(ROOT, "packages", "plugins", `plugin-${scoped.domain}`)
    const legacy = path.join(ROOT, "packages", "domains", scoped.domain)
    const created = fs.existsSync(dirOf) ? dirOf : fs.existsSync(legacy) ? legacy : null
    console.log(`\n[delivery] 特性的两半:`)
    console.log(`   规划链  docs/features/${scoped.name}/   （四件套 + feature.json）`)
    console.log(
      created
        ? `   实现    ${path.relative(ROOT, created)}/   （域名 ${scoped.domain} —— 打包/拆分部署按域工作）`
        : `   实现    尚未创建（域名 ${scoped.domain}）—— npm run domain:new ${scoped.domain}`,
    )
    console.log(`   元数据  scripts/data/${scoped.domain}-tables.ts（表定义真源，AGENTS §9.5）`)
    console.log(`   注意: 一个域可以承载多个特性；特性目录里**不该**有业务代码。`)
  }
  console.log(`\n[delivery] ${result.length} 个阶段，独立缺陷 ${distinctTotal} 项（缺失产物 ${missingArtifacts} + 未填文档 ${distinctSkeletons.size}）`)
}

main()

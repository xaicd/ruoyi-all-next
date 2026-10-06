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

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  const phases = only ? manifest.phases.filter((phase) => phase.id === only) : manifest.phases
  const result = []
  let missingTotal = 0

  for (const phase of phases) {
    const found = []
    const missing = []
    for (const pattern of phase.artifacts) {
      const hits = expand(pattern)
      if (hits.length > 0) found.push({ pattern, count: hits.length, sample: path.relative(ROOT, hits[0]) })
      else missing.push(pattern)
    }
    missingTotal += missing.length
    result.push({ id: phase.id, name: phase.name, skill: phase.skill, gate: phase.gate, found, missing })
  }

  if (asJson) {
    console.log(JSON.stringify({ phases: result, missingTotal }, null, 2))
    return
  }
  for (const phase of result) {
    console.log(`\n${phase.missing.length === 0 ? "✅" : "⚠️"} ${phase.name}（${phase.id}）  技能: ${phase.skill}  门禁: ${phase.gate}`)
    for (const item of phase.found) console.log(`   ✓ ${item.pattern}  (${item.count} 个，如 ${item.sample})`)
    for (const item of phase.missing) console.log(`   ✗ ${item}  —— 尚无产物`)
  }
  console.log(`\n[delivery] ${result.length} 个阶段，缺失产物 ${missingTotal} 项`)
}

main()

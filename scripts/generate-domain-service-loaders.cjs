#!/usr/bin/env node
/**
 * 由 `rpc-actions.json` 生成 `domain-service-loaders.ts`。
 *
 * 为什么需要它:
 *   跨域调用的真实派发路径是
 *     Facade -> broker.call -> invokeAction -> rpc-actions.json 查 service/module/target
 *     -> DOMAIN_SERVICE_LOADERS[域][模块] 静态 import -> 调目标方法
 *   而这张 loader 表此前是**手工维护**的（文件头注着"模块清单取自 rpc-actions.json"，
 *   但没有任何东西真的去生成它）—— 加了域/模块忘登记，跨域调用就会在运行时才炸。
 *
 * 为什么必须静态列举、不能用模板字符串动态 import:
 *   `import(\`@/modules/${domain}/backend/services/${module}\`)` 这类「前缀 + 动态段」
 *   Turbopack 无法解析（实测 build 报 'Module not found: Can't resolve ... <dynamic>'）。
 *
 * 用法:
 *   node scripts/generate-domain-service-loaders.cjs            # dry-run
 *   node scripts/generate-domain-service-loaders.cjs --write
 *   node scripts/generate-domain-service-loaders.cjs --check    # 门禁: 是否漂移
 */
const fs = require("node:fs")
const path = require("node:path")

const ROOT = path.resolve(__dirname, "..")
const CATALOG = path.join(ROOT, "packages", "shared", "backend", "constants", "rpc-actions.json")
const OUT = path.join(ROOT, "packages", "shared", "backend", "lib", "domain-service-loaders.ts")
const write = process.argv.includes("--write")
const check = process.argv.includes("--check")

/** 域 -> 包内目录（plugins/plugin-<域> 或 domains/<域>），由 domain-catalog 决定。 */
function resolveDomainDir(domain) {
  const { domainPathOf } = require("./lib/domain-catalog.cjs")
  try {
    const resolved = domainPathOf(domain)
    return path.relative(ROOT, resolved).replace(/\\/g, "/")
  } catch {
    return null
  }
}

function render() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"))
  const domains = Object.keys(catalog.domains ?? {}).sort()

  const lines = []
  for (const domain of domains) {
    const modules = new Set(["index"])
    for (const action of catalog.domains[domain].actions ?? []) {
      if (typeof action.module === "string" && action.module) modules.add(action.module)
    }
    lines.push(`  ${JSON.stringify(domain)}: {`)
    for (const moduleName of [...modules].sort()) {
      lines.push(`    ${JSON.stringify(moduleName)}: () => import("@/modules/${domain}/backend/services/${moduleName}"),`)
    }
    lines.push("  },")
  }

  return `/**
 * 各域 services 的**静态** loader 映射（两级: 域 -> 模块）。
 *
 * 由 scripts/generate-domain-service-loaders.cjs 从 rpc-actions.json 生成，**勿手改**
 * （加了域或模块后跑该脚本重生成；--check 是门禁）。
 *
 * 为什么不能用模板字符串动态 import:
 *   broker 原先写 import(\`@/modules/\${domain}/backend/services/\${module}\`) ——
 *   这类「前缀 + 动态段」Turbopack 无法解析（实测 build 报
 *   'Module not found: Can't resolve \\'@/modules/\\' <dynamic>' / strip_prefix prefix is too long），
 *   改相对路径同样失败。显式列出每条 (域, 模块) 后动态前缀消失。
 *
 * 为什么必须从 catalog 生成:
 *   这张表此前是手工维护的（文件头写着"清单取自 rpc-actions.json"，却没人真的生成它）——
 *   注册新域/新模块时漏登记，跨域调用只会在**运行时**才炸。现在两者同源。
 */

type Loader = () => Promise<Record<string, unknown>>

export const DOMAIN_SERVICE_LOADERS: Record<string, Record<string, Loader>> = {
${lines.join("\n")}
}
`
}

function main() {
  const content = render()
  if (check) {
    if (!fs.existsSync(OUT)) {
      console.error("[domain-loaders] FAIL: domain-service-loaders.ts 不存在")
      process.exit(1)
    }
    if (fs.readFileSync(OUT, "utf8") !== content) {
      console.error("[domain-loaders] FAIL: 与 rpc-actions.json 不一致 —— 跑 node scripts/generate-domain-service-loaders.cjs --write")
      process.exit(1)
    }
    console.log("[domain-loaders] PASS: 与 rpc-actions.json 一致")
    return
  }
  const changed = !fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== content
  console.log(`[domain-loaders] ${changed ? "有变化" : "无变化"}（域数 ${Object.keys(JSON.parse(fs.readFileSync(CATALOG, "utf8")).domains ?? {}).length}）`)
  if (!write) {
    console.log("  (dry-run: 加 --write 写入)")
    return
  }
  fs.writeFileSync(OUT, content)
  console.log(`  ✓ 已写 ${path.relative(ROOT, OUT)}`)
}

main()

const fs = require("fs")
const path = require("path")

const root = path.resolve(__dirname, "..")
const routesRoot = path.join(root, "src", "app", "api", "v1", "admin")
const outputPath = path.join(root, "docs", "architecture", "artifacts", "admin-route-policy-baseline.json")

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(target, files)
    else if (entry.name === "route.ts") files.push(target)
  }
  return files
}

function methods(source) {
  return [...source.matchAll(/export\s+(?:async\s+function|const)\s+(GET|POST|PUT|PATCH|DELETE)\b/g)].map((match) => match[1]).sort()
}

function protection(source) {
  if (source.includes("withAdminRoute")) return "wrapper"
  if (/requireAdminAuth|requirePlatformAdmin|ensurePermission/.test(source)) return "legacy-direct-guard"
  return "proxy-authenticated"
}

function collect() {
  return walk(routesRoot).map((file) => {
    const source = fs.readFileSync(file, "utf8")
    const relative = path.relative(routesRoot, file).replace(/\\/g, "/").replace(/\/route\.ts$/, "")
    return {
      path: `/api/v1/admin/${relative === "" ? "" : relative}`.replace(/\/$/, ""),
      methods: methods(source),
      protection: protection(source),
      source: path.relative(root, file).replace(/\\/g, "/"),
    }
  }).sort((left, right) => left.path.localeCompare(right.path))
}

const routes = collect()
const baseline = { generatedAt: new Date().toISOString(), routeCount: routes.length, routes }
if (process.argv.includes("--check")) {
  if (!fs.existsSync(outputPath)) throw new Error("admin route baseline is missing; run npm run admin:routes:manifest")
  const existing = JSON.parse(fs.readFileSync(outputPath, "utf8"))
  const comparable = (value) => JSON.stringify(value.routes)
  if (existing.routeCount !== routes.length || comparable(existing) !== comparable(baseline)) throw new Error("admin route baseline is stale; run npm run admin:routes:manifest and review the policy delta")
  console.log(`[admin-route-manifest] PASS: ${routes.length} admin routes match the reviewed baseline`)
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(baseline, null, 2)}\n`)
  const summary = routes.reduce((result, route) => ({ ...result, [route.protection]: (result[route.protection] ?? 0) + 1 }), {})
  console.log(`[admin-route-manifest] wrote ${routes.length} routes: ${JSON.stringify(summary)}`)
}

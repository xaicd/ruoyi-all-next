const fs = require("fs")
const path = require("path")
const { ROOT, listDomains, toYaml, manifestPath } = require("./lib/domain-catalog.cjs")
const { loadRpcActions, renderDomain, contractPaths } = require("./lib/rpc-contracts.cjs")
const { assertSeamGraphMatches, SEAM_GRAPH_REL } = require("./lib/seam-graph.cjs")

function exists(target) {
  return fs.existsSync(path.join(ROOT, target))
}

function fail(message) {
  throw new Error(`[domain-pack:check] ${message}`)
}

const domains = listDomains()
const hatchManifestPath = path.join(ROOT, "src", "modules", "shared", "contract", "hatch-manifest.json")
const hatch = fs.existsSync(hatchManifestPath) ? JSON.parse(fs.readFileSync(hatchManifestPath, "utf8")) : null
if (!hatch?.pruned && domains.length < 16) fail(`expected at least 16 packable domains, found ${domains.length}`)
if (hatch?.pruned && Array.isArray(hatch.domains)) {
  const catalogNames = domains.map((item) => item.name).slice().sort()
  const hatchNames = [...hatch.domains].sort()
  if (catalogNames.join(",") !== hatchNames.join(",")) {
    fail(`hatch-manifest domains must match domain-catalog (${hatchNames.join(", ")})`)
  }
}

const ports = new Set()
const envs = new Set()
for (const domain of domains) {
  if (ports.has(domain.defaultPort)) fail(`duplicate defaultPort ${domain.defaultPort}`)
  if (envs.has(domain.upstreamEnv)) fail(`duplicate upstreamEnv ${domain.upstreamEnv}`)
  ports.add(domain.defaultPort)
  envs.add(domain.upstreamEnv)

  const moduleDir = path.join("src", "modules", domain.name)
  if (!exists(moduleDir)) fail(`missing module directory ${moduleDir}`)

  for (const prefix of domain.publicPrefixes) {
    const apiDir = prefix.replace(/^\/api/, "src/app/api")
    if (!exists(apiDir)) fail(`publicPrefix ${prefix} has no API directory ${apiDir}`)
  }

  const target = manifestPath(domain.name)
  if (domain.manifestMode === "handwritten") {
    if (!fs.existsSync(target)) fail(`handwritten manifest missing: ${path.relative(ROOT, target)}`)
    const source = fs.readFileSync(target, "utf8")
    if (!source.includes(`domain: ${domain.name}`) && !source.includes(`module: ${domain.name}`)) {
      fail(`handwritten manifest ${path.relative(ROOT, target)} does not declare domain ${domain.name}`)
    }
    continue
  }

  if (!fs.existsSync(target)) fail(`generated manifest missing: ${path.relative(ROOT, target)}; run npm run domain:manifests`)
  const expected = toYaml(domain)
  const actual = fs.readFileSync(target, "utf8")
  if (actual !== expected) fail(`manifest drift ${path.relative(ROOT, target)}; run npm run domain:manifests`)
}

const rpcCatalog = loadRpcActions()
for (const domain of domains) {
  if (!rpcCatalog.domains[domain.name]) fail(`rpc-actions.json missing domain ${domain.name}`)
  const expected = renderDomain(domain.name, rpcCatalog)
  const targets = contractPaths(domain.name)
  for (const [kind, file] of [["actions", targets.actions], ["facade", targets.facade], ["proto", targets.proto], ["go", targets.go]]) {
    if (!fs.existsSync(file)) fail(`missing ${kind} ${path.relative(ROOT, file)}; run npm run domain:contracts`)
    const actual = fs.readFileSync(file, "utf8")
    if (actual !== expected[kind]) fail(`contract drift ${path.relative(ROOT, file)}; run npm run domain:contracts`)
  }
}

const goModPath = path.join(ROOT, "gen", "go", "go.mod")
if (!fs.existsSync(goModPath) || !fs.readFileSync(goModPath, "utf8").includes("module ruoyi/all-next/gen")) {
  fail("missing gen/go/go.mod; run npm run domain:contracts")
}

if (!fs.existsSync(path.join(ROOT, "src", "app", "api", "internal", "rpc", "route.ts"))) {
  fail("missing src/app/api/internal/rpc/route.ts for split-process RPC")
}

try {
  assertSeamGraphMatches()
} catch (error) {
  fail(error.message || String(error))
}

console.log(`[domain-pack:check] PASS: ${domains.length} domains have packable modules, API prefixes, route manifests, RPC contracts, Go stubs, and ${SEAM_GRAPH_REL}`)

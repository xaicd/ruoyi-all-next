/**
 * Capability Seam graph: generated from domain-catalog + contract/rpc, never a second domain list.
 */

const fs = require("fs")
const path = require("path")
const { ROOT, loadCatalog } = require("./domain-catalog.cjs")
const { loadRpcActions } = require("./rpc-contracts.cjs")

const SEAM_GRAPH_REL = path.join("src", "modules", "shared", "contract", "seam-graph.json").replace(/\\/g, "/")

const CONSUMER_SLOTS = [
  ["adminApi", (name) => `src/app/api/v1/admin/${name}`],
  ["appApi", (name) => `src/app/api/v1/app/${name}`],
  ["openApi", (name) => `src/app/api/v1/open/${name}`],
  ["frontendApi", (name) => `src/modules/${name}/frontend/api`],
  ["adminPages", (name) => `src/app/(admin-pages)/admin/${name}`],
  ["modulePages", (name) => `src/modules/${name}/frontend/pages`],
  ["cpcPages", (name) => `src/app/(cpc-pages)/cpc/${name}`],
  ["moduleCpcPages", (name) => `src/modules/${name}/frontend/cpc-pages`],
]

function toPosix(rel) {
  return String(rel || "").replace(/\\/g, "/")
}

function joinRoot(root, rel) {
  return path.join(root, ...toPosix(rel).split("/"))
}

function existsRel(root, rel) {
  return fs.existsSync(joinRoot(root, rel))
}

function listDirFiles(root, relDir, predicate) {
  const dir = joinRoot(root, relDir)
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return []
  return fs.readdirSync(dir)
    .filter((name) => predicate(name))
    .sort()
    .map((name) => `${toPosix(relDir)}/${name}`)
}

function methodsFor(rpcActions, domainName) {
  const spec = rpcActions?.domains?.[domainName]
  if (!spec?.actions) return []
  return spec.actions.map((item) => item.method)
}

function buildDomainSeam(root, domain, rpcActions) {
  const name = domain.name
  const contractDir = `src/modules/${name}/contract`
  const servicesDir = `src/modules/${name}/backend/services`
  const repositoriesDir = `src/modules/${name}/backend/repositories`

  const facades = listDirFiles(root, contractDir, (file) => file.endsWith(".facade.ts"))
  const actions = listDirFiles(root, contractDir, (file) => file === "actions.ts" || file.endsWith(".actions.ts"))
  const protos = listDirFiles(root, contractDir, (file) => file.endsWith(".proto"))
  const manifests = listDirFiles(root, contractDir, (file) => file === "route.manifest.yaml")

  const consumer = {}
  for (const [key, relOf] of CONSUMER_SLOTS) {
    const rel = relOf(name)
    if (existsRel(root, rel)) consumer[key] = rel
  }

  const definition = {
    dir: existsRel(root, contractDir) ? contractDir : null,
    facades,
    actions,
    proto: protos[0] || null,
    manifest: manifests[0] || null,
  }
  const provider = {
    servicesDir: existsRel(root, servicesDir) ? servicesDir : null,
    repositoriesDir: existsRel(root, repositoriesDir) ? repositoriesDir : null,
    methods: methodsFor(rpcActions, name),
  }
  const rolesComplete = Boolean(
    definition.dir
      && facades.length > 0
      && provider.servicesDir
      && Object.keys(consumer).length > 0,
  )

  return {
    name,
    kind: domain.kind,
    stage: domain.stage,
    definition,
    provider,
    consumer,
    rolesComplete,
  }
}

function buildSeamGraph({ root = ROOT, catalog, rpcActions } = {}) {
  const sourceCatalog = catalog || loadCatalog()
  const sourceRpc = rpcActions || loadRpcActions()
  const domains = (sourceCatalog.domains || []).map((domain) => buildDomainSeam(root, domain, sourceRpc))
  return {
    version: 1,
    kind: "capability-seam-graph",
    generated: true,
    source: "src/modules/shared/backend/constants/domain-catalog.json",
    generatedBy: "scripts/lib/seam-graph.cjs",
    note: "Do not hand-edit domain names. Run npm run domain:seams after catalog/contract changes.",
    domains,
  }
}

function renderSeamGraph(options) {
  return `${JSON.stringify(buildSeamGraph(options), null, 2)}\n`
}

function seamGraphPath(root = ROOT) {
  return joinRoot(root, SEAM_GRAPH_REL)
}

function writeSeamGraph(options = {}) {
  const root = options.root || ROOT
  const target = seamGraphPath(root)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, renderSeamGraph(options), "utf8")
  return toPosix(path.relative(root, target))
}

function assertSeamGraphMatches(options = {}) {
  const root = options.root || ROOT
  const expected = renderSeamGraph(options)
  const target = seamGraphPath(root)
  if (!fs.existsSync(target)) {
    throw new Error(`missing ${SEAM_GRAPH_REL}; run npm run domain:seams`)
  }
  const actual = fs.readFileSync(target, "utf8")
  if (actual !== expected) {
    throw new Error(`seam-graph drift in ${SEAM_GRAPH_REL}; run npm run domain:seams`)
  }
  const graph = JSON.parse(actual)
  const catalogNames = (options.catalog || loadCatalog()).domains.map((item) => item.name)
  const graphNames = (graph.domains || []).map((item) => item.name)
  if (catalogNames.join("\0") !== graphNames.join("\0")) {
    throw new Error("seam-graph domain names must match domain-catalog.json exactly")
  }
  const incomplete = (graph.domains || []).filter((item) => !item.rolesComplete).map((item) => item.name)
  if (incomplete.length) {
    throw new Error(`seam triangle incomplete for: ${incomplete.join(", ")}`)
  }
  return graph
}

module.exports = {
  SEAM_GRAPH_REL,
  buildSeamGraph,
  renderSeamGraph,
  writeSeamGraph,
  assertSeamGraphMatches,
  seamGraphPath,
}

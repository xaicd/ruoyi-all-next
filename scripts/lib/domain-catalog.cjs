const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "../..")
const CATALOG_PATH = path.join(ROOT, "src", "modules", "shared", "backend", "constants", "domain-catalog.json")

function loadCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"))
}

function listDomains() {
  return loadCatalog().domains
}

function getDomain(name) {
  const domain = listDomains().find((entry) => entry.name === name)
  if (!domain) {
    throw new Error(`Unknown domain: ${name}. Use --list to see packable domains.`)
  }
  return domain
}

function toYaml(domain) {
  const prefixes = domain.publicPrefixes.map((prefix) => `  - ${prefix}`).join("\n")
  const modules = ["shared", domain.name]
    .filter((value, index, list) => list.indexOf(value) === index)
    .map((name) => `    - ${name}`)
    .join("\n")
  return `# Generated from src/modules/shared/backend/constants/domain-catalog.json
# Do not hand-edit pack/upstream fields. Run: npm run domain:manifests
domain: ${domain.name}
owner: ${domain.owner}
kind: ${domain.kind}
stage: ${domain.stage}
contractVersion: ${domain.contractVersion}
implementation: ${domain.implementation}
publicPrefix:
${prefixes}
upstream:
  env: ${domain.upstreamEnv}
  protocol: http
  defaultPort: ${domain.defaultPort}
auth:
  audience: ${domain.auth.audience}
  tenantPolicy: ${domain.auth.tenantPolicy}
resilience:
  timeoutMs: ${domain.resilience.timeoutMs}
  retry:
    maxAttempts: ${domain.resilience.retryMaxAttempts}
    safeMethodsOnly: ${domain.resilience.safeMethodsOnly}
  idempotencyRequired: ${domain.resilience.idempotencyRequired}
rollout:
  mode: local
messaging:
  transport: in-process
  queueGroup: ruoyi.${domain.name}
  commandSubject: ruoyi.cmd.${domain.name}.>
  eventSubject: ruoyi.evt.${domain.name}.>
invoke:
  colocated: sdk
  remote: rpc
  protocol: nats-rr
  serialization: json
  facade: required
pack:
  enabled: ${domain.packable}
  kind: ${domain.packKind}
  independentDatabase: ${domain.independentDatabase}
  dependsOnModules:
${modules}
`
}

function manifestPath(domainName) {
  return path.join(ROOT, "src", "modules", domainName, "contract", "route.manifest.yaml")
}

function writeGeneratedManifests() {
  const written = []
  for (const domain of listDomains()) {
    if (domain.manifestMode === "handwritten") continue
    const target = manifestPath(domain.name)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, toYaml(domain))
    written.push(path.relative(ROOT, target).replace(/\\/g, "/"))
  }
  return written
}

// ---------------------------------------------------------------------------
// Plugin manifest (P0): aggregate already-existing contract sources — never a
// second source of truth. Every field below is parsed out of a file that the
// repo already maintains, so drift is impossible by construction.
// ---------------------------------------------------------------------------

const CONTRACT_DIR = (domainName) => path.join(ROOT, "src", "modules", domainName, "contract")

function readTextIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""
}

/** 每个 *.facade.ts 导出的 `*_FACADE_METHODS` 方法名。 */
function readFacadeSurfaces(domainName) {
  const dir = CONTRACT_DIR(domainName)
  if (!fs.existsSync(dir)) return []
  const surfaces = []
  for (const entry of fs.readdirSync(dir).filter((f) => f.endsWith(".facade.ts")).sort()) {
    const source = readTextIfExists(path.join(dir, entry))
    const match = source.match(/_FACADE_METHODS\s*=\s*\[([\s\S]*?)\]\s*as const/)
    if (!match) continue
    const methods = [...match[1].matchAll(/"([^"]+)"/g)].map((m) => m[1])
    if (methods.length > 0) surfaces.push({ file: entry, methods })
  }
  return surfaces
}

/** `<domain>.proto` 中的 service/rpc 列表。 */
function readProtoRpcs(domainName) {
  const source = readTextIfExists(path.join(CONTRACT_DIR(domainName), `${domainName}.proto`))
  if (!source) return []
  const rpcs = []
  let service = ""
  for (const line of source.split("\n")) {
    const svc = line.match(/^\s*service\s+([A-Za-z0-9_]+)\s*\{/)
    if (svc) {
      service = svc[1]
      continue
    }
    const rpc = line.match(/^\s*rpc\s+([A-Za-z0-9_]+)\s*\(/)
    if (rpc && service) rpcs.push({ service, method: rpc[1] })
  }
  return rpcs
}

/** `actions.ts` 中以 `<domain>.` 为前缀的 action key。 */
function readActionKeys(domainName) {
  const source = readTextIfExists(path.join(CONTRACT_DIR(domainName), "actions.ts"))
  if (!source) return []
  const pattern = new RegExp(`"${domainName}\\.([A-Za-z0-9_]+)"\\s*:`, "g")
  return [...source.matchAll(pattern)].map((m) => `${domainName}.${m[1]}`)
}

/** 权限码 `<domain>:<resource>:<action>`，按域名归组（单次解析，供所有域复用）。 */
function readPermissionsByDomain() {
  const source = readTextIfExists(
    path.join(ROOT, "src", "modules", "shared", "backend", "constants", "permissions.ts"),
  )
  const byDomain = new Map()
  for (const match of source.matchAll(/"([a-z0-9-]+):([a-z0-9-]+):([a-z0-9-]+)"/g)) {
    const [code, domain] = [match[0].slice(1, -1), match[1]]
    if (!byDomain.has(domain)) byDomain.set(domain, new Set())
    byDomain.get(domain).add(code)
  }
  for (const [key, value] of byDomain) byDomain.set(key, [...value].sort())
  return byDomain
}

/** 域名 → 中文标签。真源：admin-menu.ts 的顶层条目（key=域名, label=中文）。 */
function readDomainLabels() {
  const source = readTextIfExists(
    path.join(ROOT, "src", "modules", "shared", "backend", "constants", "admin-menu.ts"),
  )
  const labels = new Map()
  for (const match of source.matchAll(/^ {4}key: "([a-z0-9-]+)",\n {4}label: "([^"]+)",/gm)) {
    labels.set(match[1], match[2])
  }
  return labels
}

/**
 * capability 由「真实声明」推导，而不是手工编造：
 * 声明是请求，不是授权 —— 与 Paperclip manifest 的语义一致。
 */
function deriveCapabilities(domain, sources) {
  const capabilities = ["api.routes.register"]
  if (sources.facades.length > 0) capabilities.push("facade.invoke")
  if (sources.rpcs.length > 0) capabilities.push("rpc.serve")
  if (sources.actions.length > 0) capabilities.push("cmd.dispatch")
  if (domain.packable) capabilities.push("pack.independent")
  return capabilities
}

function toPluginManifest(domain, sources, labels = new Map()) {
  const methods = [...new Set(sources.facades.flatMap((surface) => surface.methods))]
  return {
    $schema: "ruoyi-plugin-manifest/v1",
    // 对齐 Paperclip 的 `<org>.<name>` 命名习惯
    id: `ruoyi.${domain.name}`,
    apiVersion: 1,
    displayName: labels.get(domain.name) || domain.name,
    kind: domain.kind,
    stage: domain.stage,
    owner: domain.owner,
    contractVersion: domain.contractVersion,
    implementation: domain.implementation,
    minimumHostVersion: "1.0.0",
    capabilities: deriveCapabilities(domain, sources),
    entrypoints: {
      facade: sources.facades.map((surface) => `src/modules/${domain.name}/contract/${surface.file}`),
      proto: fs.existsSync(path.join(CONTRACT_DIR(domain.name), `${domain.name}.proto`))
        ? `src/modules/${domain.name}/contract/${domain.name}.proto`
        : null,
      actions: fs.existsSync(path.join(CONTRACT_DIR(domain.name), "actions.ts"))
        ? `src/modules/${domain.name}/contract/actions.ts`
        : null,
    },
    apiRoutes: {
      publicPrefix: domain.publicPrefixes,
      adminPrefix: `/api/v1/admin/${domain.name}`,
    },
    auth: { audience: domain.auth.audience, tenantPolicy: domain.auth.tenantPolicy },
    messaging: {
      queueGroup: `ruoyi.${domain.name}`,
      commandSubject: `ruoyi.cmd.${domain.name}.>`,
      eventSubject: `ruoyi.evt.${domain.name}.>`,
    },
    invoke: { colocated: "sdk", remote: "rpc", protocol: "nats-rr", serialization: "json" },
    upstream: { env: domain.upstreamEnv, protocol: "http", defaultPort: domain.defaultPort },
    // 与 route.manifest.yaml 保持同一嵌套形状, 避免同一事实两种表达
    resilience: {
      timeoutMs: domain.resilience.timeoutMs,
      retry: {
        maxAttempts: domain.resilience.retryMaxAttempts,
        safeMethodsOnly: domain.resilience.safeMethodsOnly,
      },
      idempotencyRequired: domain.resilience.idempotencyRequired,
    },
    facadeMethods: methods,
    rpc: sources.rpcs,
    actions: sources.actions,
    permissions: sources.permissions,
    dependsOn: domain.dependsOnModules,
    pack: {
      enabled: domain.packable,
      kind: domain.packKind,
      independentDatabase: domain.independentDatabase,
    },
  }
}

function pluginManifestPath(domainName) {
  return path.join(ROOT, "src", "modules", domainName, "contract", "plugin.manifest.json")
}

function writeGeneratedPluginManifests() {
  const permissionsByDomain = readPermissionsByDomain()
  const labels = readDomainLabels()
  const written = []
  for (const domain of listDomains()) {
    if (domain.manifestMode === "handwritten") continue
    const sources = {
      facades: readFacadeSurfaces(domain.name),
      rpcs: readProtoRpcs(domain.name),
      actions: readActionKeys(domain.name),
      permissions: permissionsByDomain.get(domain.name) || [],
    }
    const target = pluginManifestPath(domain.name)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, `${JSON.stringify(toPluginManifest(domain, sources, labels), null, 2)}\n`)
    written.push(path.relative(ROOT, target).replace(/\\/g, "/"))
  }
  return written
}

module.exports = {
  ROOT,
  CATALOG_PATH,
  loadCatalog,
  listDomains,
  getDomain,
  toYaml,
  manifestPath,
  writeGeneratedManifests,
  readFacadeSurfaces,
  readProtoRpcs,
  readActionKeys,
  readPermissionsByDomain,
  toPluginManifest,
  pluginManifestPath,
  writeGeneratedPluginManifests,
}

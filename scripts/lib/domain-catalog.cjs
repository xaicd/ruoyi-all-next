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

module.exports = {
  ROOT,
  CATALOG_PATH,
  loadCatalog,
  listDomains,
  getDomain,
  toYaml,
  manifestPath,
  writeGeneratedManifests,
}

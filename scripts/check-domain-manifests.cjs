/**
 * 生成物漂移检查：提交的 route/plugin manifest 是否与生成器当前输出一致。
 *
 * 为什么需要它：`npm run check` 里的 contracts:sync 会**重新生成** manifest，
 * 所以生成物永远是"新鲜"的 —— 手改生成物、或改了真源却忘了重新生成并提交，
 * 都不会被发现。本检查放在 contracts:sync **之前**，专门拦这两类漂移。
 *
 * 用法：node scripts/check-domain-manifests.cjs
 * 退出码 1 = 存在漂移。
 */
const fs = require("fs")
const path = require("path")

const {
  ROOT,
  listDomains,
  toYaml,
  manifestPath,
  readFacadeSurfaces,
  readProtoRpcs,
  readActionKeys,
  readPermissionsByDomain,
  readDomainLabels,
  toPluginManifest,
  pluginManifestPath,
  pluginRegistryPath,
  toPluginRegistrySource,
} = require("./lib/domain-catalog.cjs")

const readIfExists = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null)
const rel = (file) => path.relative(ROOT, file).replace(/\\/g, "/")

const drifted = []
let checked = 0

const permissionsByDomain = readPermissionsByDomain()
const labels = readDomainLabels()

for (const domain of listDomains()) {
  if (domain.manifestMode === "handwritten") continue
  checked += 1

  // 1) route manifest（YAML）
  const routeTarget = manifestPath(domain.name)
  const routeExpected = toYaml(domain)
  const routeActual = readIfExists(routeTarget)
  if (routeActual === null) drifted.push(`${rel(routeTarget)}: 缺失（运行 npm run domain:manifests）`)
  else if (routeActual !== routeExpected) drifted.push(`${rel(routeTarget)}: 与真源不一致`)

  // 2) plugin manifest（JSON）
  const sources = {
    facades: readFacadeSurfaces(domain.name),
    rpcs: readProtoRpcs(domain.name),
    actions: readActionKeys(domain.name),
    permissions: permissionsByDomain.get(domain.name) || [],
  }
  const pluginTarget = pluginManifestPath(domain.name)
  const pluginExpected = `${JSON.stringify(toPluginManifest(domain, sources, labels), null, 2)}\n`
  const pluginActual = readIfExists(pluginTarget)
  if (pluginActual === null) drifted.push(`${rel(pluginTarget)}: 缺失（运行 npm run domain:manifests）`)
  else if (pluginActual !== pluginExpected) drifted.push(`${rel(pluginTarget)}: 与真源不一致`)
}

// 3) plugin registry 静态索引
const registryTarget = pluginRegistryPath()
const registryExpected = toPluginRegistrySource(
  listDomains().filter((domain) => domain.manifestMode !== "handwritten"),
)
const registryActual = readIfExists(registryTarget)
if (registryActual === null) drifted.push(`${rel(registryTarget)}: 缺失（运行 npm run domain:manifests）`)
else if (registryActual !== registryExpected) drifted.push(`${rel(registryTarget)}: 与真源不一致`)

if (drifted.length > 0) {
  console.error(`[domain-manifests:check] ✗ ${drifted.length} 处漂移（共检查 ${checked} 个域）：`)
  for (const item of drifted) console.error(`  - ${item}`)
  console.error("修复：npm run domain:manifests 后提交生成物。禁止手改生成物。")
  process.exit(1)
}

console.log(`[domain-manifests:check] PASS: ${checked} 个域的 route/plugin manifest 与真源一致`)

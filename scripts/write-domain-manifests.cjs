const {
  writeGeneratedManifests,
  writeGeneratedPluginManifests,
  writeGeneratedPluginRegistry,
} = require("./lib/domain-catalog.cjs")

const routeManifests = writeGeneratedManifests()
console.log(`[domain-manifests] wrote ${routeManifests.length} route manifests:`)
for (const file of routeManifests) console.log(`  ${file}`)

// P0: 插件化声明面。全部字段由既有真源(domain-catalog / facade / proto / actions / permissions)
// 聚合而来, 不是第二份真源 —— 详见 docs/architecture/ruoyi-all-next-module-to-plugin-migration.md
const pluginManifests = writeGeneratedPluginManifests()
console.log(`[domain-manifests] wrote ${pluginManifests.length} plugin manifests:`)
for (const file of pluginManifests) console.log(`  ${file}`)

// P1: 各域 manifest 的静态索引(供运行时加载)
console.log(`[domain-manifests] wrote plugin registry: ${writeGeneratedPluginRegistry()}`)

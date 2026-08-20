const fs = require("fs")
const { writeGeneratedManifests } = require("./lib/domain-catalog.cjs")

const written = writeGeneratedManifests()
console.log(`[domain-manifests] wrote ${written.length} route manifests:`)
for (const file of written) console.log(`  ${file}`)

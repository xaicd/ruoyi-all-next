/**
 * fix-service-export-aliases.cjs
 * 
 * For each service that index.ts re-exports with a System prefix but the class
 * doesn't have that prefix, add an alias export.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const servicesDir = path.join(ROOT, 'src/modules/system/backend/services')
const indexFile = path.join(servicesDir, 'index.ts')

const indexContent = fs.readFileSync(indexFile, 'utf-8')
const exportLines = indexContent.split('\n').filter(l => l.includes('export {'))

let fixed = 0

for (const line of exportLines) {
  const m = line.match(/export\s*{\s*(\w+)\s*}\s*from\s*"\.\/(.+?)"/)
  if (!m) continue
  
  const [, expectedExport, relPath] = m
  const filePath = path.join(servicesDir, relPath + '.ts')
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${relPath}.ts`)
    continue
  }
  
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // Check if the expected export exists
  if (content.includes(`export class ${expectedExport}`)) continue // Already correct
  if (content.includes(`export { ${expectedExport}`) || content.includes(`as ${expectedExport}`)) continue // Already has alias
  
  // Find actual class name
  const classMatch = content.match(/export class (\w+)/)
  if (!classMatch) {
    console.log(`  ⚠️  No class found in ${relPath}.ts`)
    continue
  }
  
  const actualName = classMatch[1]
  if (actualName === expectedExport) continue
  
  // Add alias export
  const alias = `\n// Alias for index.ts re-export\nexport { ${actualName} as ${expectedExport} }\n`
  fs.writeFileSync(filePath, content + alias)
  fixed++
  console.log(`  ✅ ${relPath}.ts: ${actualName} → ${expectedExport}`)
}

console.log(`\nFixed ${fixed} export aliases.`)

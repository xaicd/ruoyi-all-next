/**
 * fix-export-names.cjs
 * 
 * Finds cases where routes import `SystemXxxService` but the service file
 * exports `XxxService` (without the domain prefix), and adds re-export aliases.
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')

// Get build-breaking "was not found" errors from tsc
let errorOutput = ''
try {
  execSync('node node_modules/typescript/bin/tsc --noEmit 2>&1', { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 })
} catch (e) {
  errorOutput = (e.stdout || '') + (e.stderr || '')
}

// Find TS2305: Module 'x' has no exported member 'Y'
// Find TS2614: Module 'x' has no exported member 'Y'. Did you mean to use 'import Y from "x"'?
const exportErrors = errorOutput.split('\n').filter(l => 
  (l.includes('TS2305') || l.includes('TS2614')) && l.includes('Service')
)

console.log(`Found ${exportErrors.length} export-not-found errors for Services`)

const fixes = new Map() // filePath -> Map<importedName, actualClass>

for (const line of exportErrors) {
  // Pattern: '...Service' ... from "path"
  const m = line.match(/'"?(\w+Service)"?.*?has no exported member/)
  if (!m) continue
  // Also try to get the file
  const fileMatch = line.match(/^(.+?)\(\d+,\d+\)/)
  if (!fileMatch) continue
  
  const importFile = path.resolve(ROOT, fileMatch[1])
  if (!fs.existsSync(importFile)) continue
  
  const content = fs.readFileSync(importFile, 'utf-8')
  // Find import line with the missing name
  const importLineMatch = content.match(new RegExp(`import\\s*{\\s*(${m[1]})\\s*}\\s*from\\s*"(.+?)"`))
  if (!importLineMatch) continue
  
  const [, importedName, importPath] = importLineMatch
  
  // Resolve the module
  let modulePath
  if (importPath.startsWith('@/')) {
    modulePath = path.join(ROOT, 'src', importPath.replace('@/', '') + '.ts')
  }
  if (!modulePath || !fs.existsSync(modulePath)) continue
  
  // Read module and find actual class name
  const moduleContent = fs.readFileSync(modulePath, 'utf-8')
  const classMatch = moduleContent.match(/export class (\w+Service)/)
  if (!classMatch) continue
  
  const actualName = classMatch[1]
  if (actualName === importedName) continue // Already matches
  
  if (!fixes.has(modulePath)) fixes.set(modulePath, new Map())
  fixes.get(modulePath).set(importedName, actualName)
}

// Apply fixes: add alias exports
let fixed = 0
for (const [modulePath, aliases] of fixes.entries()) {
  let content = fs.readFileSync(modulePath, 'utf-8')
  
  for (const [alias, actual] of aliases.entries()) {
    if (content.includes(`export { ${actual} as ${alias} }`)) continue
    // Add alias at the end
    content += `\nexport { ${actual} as ${alias} }\n`
    fixed++
    console.log(`  ✅ ${path.relative(ROOT, modulePath)}: export { ${actual} as ${alias} }`)
  }
  
  fs.writeFileSync(modulePath, content)
}

console.log(`\nAdded ${fixed} export aliases.`)

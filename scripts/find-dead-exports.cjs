const fs = require('fs')
const path = require('path')

const dirs = [
  'src/modules/system/backend/services',
  'src/modules/infra/backend/services',
]

const ROOT = path.resolve(__dirname, '..')

dirs.forEach(d => {
  const dir = path.join(ROOT, d)
  const indexFile = path.join(dir, 'index.ts')
  if (!fs.existsSync(indexFile)) return
  
  const content = fs.readFileSync(indexFile, 'utf-8')
  const lines = content.split('\n')
  const deadLines = []
  
  lines.forEach((line, i) => {
    const m = line.match(/from\s+"\.\/(.+?)"/)
    if (m) {
      const target = path.join(dir, m[1] + '.ts')
      if (!fs.existsSync(target)) {
        deadLines.push({ line: i, text: line.trim(), missing: m[1] + '.ts' })
      }
    }
  })
  
  if (deadLines.length > 0) {
    console.log(`\n${d}/index.ts: ${deadLines.length} dead exports`)
    deadLines.forEach(d => console.log(`  MISSING: ${d.missing}`))
    
    // Remove dead lines
    const newContent = lines.filter((_, i) => !deadLines.some(d => d.line === i)).join('\n')
    fs.writeFileSync(indexFile, newContent)
    console.log(`  -> Removed ${deadLines.length} dead exports`)
  }
})

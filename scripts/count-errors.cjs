const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const ROOT = path.resolve(__dirname, '..')
let out = ''
try { execSync('node node_modules/typescript/bin/tsc --noEmit 2>&1', { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10*1024*1024 }) }
catch (e) { out = (e.stdout||'')+(e.stderr||'') }
const errors = out.split('\n').filter(l => l.includes('error TS'))

// Categorize
const byCode = new Map()
errors.forEach(e => { const m = e.match(/error (TS\d+)/); if (m) byCode.set(m[1], (byCode.get(m[1])||0)+1) })

const report = [`Total: ${errors.length} errors\n`, '=== By code ===']
;[...byCode.entries()].sort((a,b)=>b[1]-a[1]).forEach(([c,n]) => report.push(`  ${c}: ${n}`))

// Top files
const byFile = new Map()
errors.forEach(e => { const m = e.match(/^(.+?)\(\d+/); if(m) byFile.set(m[1],(byFile.get(m[1])||0)+1) })
report.push('\n=== Top files ===')
;[...byFile.entries()].sort((a,b)=>b[1]-a[1]).slice(0,15).forEach(([f,n]) => report.push(`  ${n}: ${f}`))

report.push('\n=== First 15 errors ===')
errors.slice(0,15).forEach(e => report.push('  '+e.substring(0,250)))

fs.writeFileSync(path.join(ROOT, 'error-count.txt'), report.join('\n'))

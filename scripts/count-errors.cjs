const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')
let out = ''
try { execSync('node node_modules/typescript/bin/tsc --noEmit 2>&1', { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10*1024*1024 }) }
catch (e) { out = (e.stdout||'')+(e.stderr||'') }
const errors = out.split('\n').filter(l => l.includes('error TS'))
fs.writeFileSync(path.join(ROOT, 'error-count.txt'), `${errors.length} errors`)

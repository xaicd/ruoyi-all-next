/**
 * analyze-errors.cjs - Categorize remaining TS errors for targeted fixes
 */
const { execSync } = require('child_process')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')

let output = ''
try {
  execSync('node node_modules/typescript/bin/tsc --noEmit 2>&1', { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 })
} catch (e) { output = (e.stdout || '') + (e.stderr || '') }

const errors = output.split('\n').filter(l => l.includes('error TS'))

// Categorize by error code
const byCode = new Map()
errors.forEach(e => {
  const m = e.match(/error (TS\d+)/)
  if (m) byCode.set(m[1], (byCode.get(m[1]) || 0) + 1)
})

console.log('=== Error codes ===')
;[...byCode.entries()].sort((a,b) => b[1] - a[1]).forEach(([code, count]) => {
  console.log(`  ${code}: ${count}`)
})

// Categorize by domain (test vs app vs service)
let testErrors = 0, routeErrors = 0, serviceErrors = 0, otherErrors = 0
errors.forEach(e => {
  if (e.includes('__tests__') || e.includes('.test.ts')) testErrors++
  else if (e.includes('/app/api/')) routeErrors++
  else if (e.includes('/services/')) serviceErrors++
  else otherErrors++
})

console.log('\n=== By location ===')
console.log(`  Test files: ${testErrors}`)
console.log(`  API routes: ${routeErrors}`)
console.log(`  Services: ${serviceErrors}`)
console.log(`  Other: ${otherErrors}`)

// Show specific TS2345 (type mismatch) patterns
const ts2345 = errors.filter(e => e.includes('TS2345'))
console.log(`\n=== TS2345 samples (${ts2345.length} total) ===`)
ts2345.slice(0, 5).forEach(e => console.log('  ' + e.substring(0, 250)))

// Show TS2339 (property not found) patterns  
const ts2339 = errors.filter(e => e.includes('TS2339'))
console.log(`\n=== TS2339 samples (${ts2339.length} total) ===`)
ts2339.slice(0, 5).forEach(e => console.log('  ' + e.substring(0, 250)))

// Show TS2307 (module not found) patterns
const ts2307 = errors.filter(e => e.includes('TS2307'))
console.log(`\n=== TS2307 samples (${ts2307.length} total) ===`)
ts2307.slice(0, 5).forEach(e => console.log('  ' + e.substring(0, 250)))

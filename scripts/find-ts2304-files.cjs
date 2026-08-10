/**
 * Find files with TS2304 (Cannot find name) errors and show the error context
 */
const { execSync } = require('child_process')
const path = require('path')
const ROOT = path.resolve(__dirname, '..')

let output = ''
try {
  execSync('node node_modules/typescript/bin/tsc --noEmit 2>&1', { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 })
} catch (e) { output = (e.stdout || '') + (e.stderr || '') }

const ts2304 = output.split('\n').filter(l => l.includes('TS2304') || l.includes('TS18004'))

// Group by file
const byFile = new Map()
ts2304.forEach(l => {
  const m = l.match(/^(.+?)\(\d+/)
  if (m) {
    if (!byFile.has(m[1])) byFile.set(m[1], [])
    byFile.get(m[1]).push(l)
  }
})

console.log(`TS2304/TS18004: ${ts2304.length} errors in ${byFile.size} files\n`)

// Write to file for reliable reading
const fs = require('fs')
const report = []
report.push(`TS2304/TS18004: ${ts2304.length} errors in ${byFile.size} files\n`)

// Show top 10 files with samples
const sorted = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length)
sorted.slice(0, 10).forEach(([file, errors]) => {
  report.push(`${errors.length} errors: ${file}`)
  errors.slice(0, 2).forEach(e => {
    const nameMatch = e.match(/Cannot find name '(\w+)'|No value exists in scope for the shorthand property '(\w+)'/)
    if (nameMatch) report.push(`    Missing: ${nameMatch[1] || nameMatch[2]}`)
  })
})

fs.writeFileSync(path.join(ROOT, 'ts-errors-report.txt'), report.join('\n'))
console.log('Written to ts-errors-report.txt')

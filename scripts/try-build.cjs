const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const ROOT = path.resolve(__dirname, '..')

console.log('Starting build...')
try {
  const out = execSync('node node_modules/next/dist/bin/next build', {
    cwd: ROOT,
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
    timeout: 600000,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production' }
  })
  fs.writeFileSync(path.join(ROOT, 'build-output.log'), out)
  console.log('BUILD SUCCESS!')
  console.log(out.slice(-1000))
} catch (e) {
  const output = (e.stdout || '') + (e.stderr || '')
  fs.writeFileSync(path.join(ROOT, 'build-output.log'), output)
  
  if (e.killed || e.signal === 'SIGTERM') {
    console.log('Build TIMEOUT (10 min)')
  } else {
    // Find the first "not found" error
    const lines = output.split('\n')
    const errorStart = lines.findIndex(l => l.includes('was not found') || l.includes('Module not found'))
    if (errorStart >= 0) {
      console.log('Build FAILED. First error:')
      lines.slice(Math.max(0, errorStart - 2), errorStart + 10).forEach(l => console.log('  ' + l))
    } else {
      console.log('Build FAILED. Last 800 chars:')
      console.log(output.slice(-800))
    }
  }
}

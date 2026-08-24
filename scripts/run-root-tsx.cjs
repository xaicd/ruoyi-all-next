const { spawnSync } = require("node:child_process")
const fs = require("node:fs")
const path = require("node:path")

const args = process.argv.slice(2)
if (args.length === 0) {
  console.log("Usage: node scripts/run-root-tsx.cjs <script-path> [args...]")
  process.exit(0)
}

const scriptRelPath = args[0]
const scriptArgs = args.slice(1)
const rootDir = process.cwd()

let targetScript = path.join(rootDir, scriptRelPath)

if (!fs.existsSync(targetScript)) {
  // Check parent monorepo if exists
  const parentRoot = path.resolve(rootDir, "../..")
  const parentScript = path.join(parentRoot, scriptRelPath)
  if (fs.existsSync(parentScript)) {
    targetScript = parentScript
  }
}

if (!fs.existsSync(targetScript)) {
  console.log(`[SKIP] Governance script omitted in standalone project: ${scriptRelPath}`)
  process.exit(0)
}

const tsxBin = path.join(rootDir, "node_modules", ".bin", process.platform === "win32" ? "tsx.cmd" : "tsx")
const cmd = fs.existsSync(tsxBin) ? tsxBin : "npx"
const cmdArgs = fs.existsSync(tsxBin) ? [targetScript, ...scriptArgs] : ["tsx", targetScript, ...scriptArgs]

const res = spawnSync(cmd, cmdArgs, { stdio: "inherit", shell: true })
process.exit(res.status ?? 0)

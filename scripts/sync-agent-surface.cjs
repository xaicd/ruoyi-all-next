/**
 * Agent Surface Synchronizer & Drift Guard.
 *
 * Keeps root-level and public-facing standard discovery files in sync with
 * internal contracts:
 * - packages/shared/contract/compat-manifest.json -> compat-manifest.json & public/compat-manifest.json
 * - packages/shared/contract/agent-profile.json   -> agent-profile.json & public/agent-profile.json
 * - llms.txt                                     -> public/llms.txt & .well-known/llms.txt
 * - .well-known/agent.json                       -> public/.well-known/agent.json
 *
 * External AI agents (Cursor, Claude Code, Windsurf, Coolie, MCP clients)
 * probe root standards (llms.txt, compat-manifest.json, .well-known/agent.json)
 * and cannot guess deep monorepo internal paths.
 */

const fs = require("node:fs")
const path = require("node:path")

const ROOT = path.resolve(__dirname, "..")

const SYNC_PAIRS = [
  {
    src: "packages/shared/contract/compat-manifest.json",
    targets: ["compat-manifest.json", "public/compat-manifest.json"]
  },
  {
    src: "packages/shared/contract/agent-profile.json",
    targets: ["agent-profile.json", "public/agent-profile.json"]
  },
  {
    src: "llms.txt",
    targets: ["public/llms.txt", ".well-known/llms.txt"]
  },
  {
    src: "llms-full.txt",
    targets: ["public/llms-full.txt", ".well-known/llms-full.txt"]
  },
  {
    src: ".well-known/agent.json",
    targets: ["public/.well-known/agent.json"]
  }
]

function ensureDirFor(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function syncSurface(checkOnly = false) {
  let hasDrift = false

  for (const pair of SYNC_PAIRS) {
    const srcPath = path.join(ROOT, pair.src)
    if (!fs.existsSync(srcPath)) {
      console.error(`[agent-surface] Source file missing: ${pair.src}`)
      hasDrift = true
      continue
    }

    const srcContent = fs.readFileSync(srcPath, "utf8")

    for (const targetRel of pair.targets) {
      const targetPath = path.join(ROOT, targetRel)
      const targetExists = fs.existsSync(targetPath)
      const targetContent = targetExists ? fs.readFileSync(targetPath, "utf8") : null

      if (!targetExists || targetContent !== srcContent) {
        if (checkOnly) {
          console.error(`[agent-surface] Drift detected: ${targetRel} does not match ${pair.src}`)
          hasDrift = true
        } else {
          ensureDirFor(targetPath)
          fs.writeFileSync(targetPath, srcContent, "utf8")
          console.log(`[agent-surface] Synced: ${pair.src} -> ${targetRel}`)
        }
      }
    }
  }

  if (checkOnly && hasDrift) {
    console.error("[agent-surface] FAILED: discovery surface has drifted. Run `node scripts/sync-agent-surface.cjs` to fix.")
    process.exit(1)
  }

  if (!checkOnly) {
    console.log("[agent-surface] PASS: all discovery surfaces synchronized.")
  } else {
    console.log("[agent-surface] PASS: all discovery surfaces up to date.")
  }
}

const isCheck = process.argv.includes("--check")
syncSurface(isCheck)

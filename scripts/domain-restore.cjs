const fs = require("node:fs")
const path = require("node:path")

const sourceRoot = "d:/workspace/cw/agent-zqall"
const baseRepo = "D:/workspace/zhuangyuan/ruoyi/ruoyi-all-next"

const targetDomain = process.argv[2]

if (!targetDomain) {
  console.log("Usage: node scripts/domain-restore.cjs <domain-name>")
  console.log("Example: node scripts/domain-restore.cjs wms")
  process.exit(1)
}

if (!fs.existsSync(baseRepo)) {
  console.error(`Base repository does not exist: ${baseRepo}`)
  process.exit(1)
}

function copyDirRecursive(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return 0
  let count = 0
  fs.mkdirSync(dstDir, { recursive: true })
  const entries = fs.readdirSync(srcDir, { withFileTypes: true })
  for (const ent of entries) {
    const srcPath = path.join(srcDir, ent.name)
    const dstPath = path.join(dstDir, ent.name)
    if (ent.isDirectory()) {
      count += copyDirRecursive(srcPath, dstPath)
    } else {
      fs.copyFileSync(srcPath, dstPath)
      count++
    }
  }
  return count
}

console.log(`[DOMAIN-RESTORE] Restoring domain [${targetDomain}] from base repo...`)

let restoredCount = 0

// 1. Modules 目录
restoredCount += copyDirRecursive(
  path.join(baseRepo, `src/modules/${targetDomain}`),
  path.join(sourceRoot, `src/modules/${targetDomain}`)
)

// 2. API Routes
restoredCount += copyDirRecursive(
  path.join(baseRepo, `src/app/api/v1/admin/${targetDomain}`),
  path.join(sourceRoot, `src/app/api/v1/admin/${targetDomain}`)
)

// 3. Admin Pages
restoredCount += copyDirRecursive(
  path.join(baseRepo, `src/app/(admin-pages)/admin/${targetDomain}`),
  path.join(sourceRoot, `src/app/(admin-pages)/admin/${targetDomain}`)
)

// 4. Clients
restoredCount += copyDirRecursive(
  path.join(baseRepo, `clients/h5/src/modules/${targetDomain}`),
  path.join(sourceRoot, `clients/h5/src/modules/${targetDomain}`)
)
restoredCount += copyDirRecursive(
  path.join(baseRepo, `clients/uniapp/src/modules/${targetDomain}`),
  path.join(sourceRoot, `clients/uniapp/src/modules/${targetDomain}`)
)
restoredCount += copyDirRecursive(
  path.join(baseRepo, `clients/flutter/lib/modules/${targetDomain}`),
  path.join(sourceRoot, `clients/flutter/lib/modules/${targetDomain}`)
)

console.log(`[DOMAIN-RESTORE] Successfully restored domain [${targetDomain}] (${restoredCount} files copied from base repo)!`)

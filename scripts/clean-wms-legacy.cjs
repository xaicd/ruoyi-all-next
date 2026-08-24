const fs = require("node:fs")
const path = require("node:path")

const roots = [
  "d:/workspace/cw/agent-zqall",
  "D:/workspace/zhuangyuan/ruoyi/ruoyi-all-next",
]

function removeDirOrFile(fullPath) {
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true })
    console.log(`  -> Removed: ${fullPath}`)
  }
}

for (const root of roots) {
  if (!fs.existsSync(root)) continue
  console.log(`[CLEAN-LEGACY] Cleaning legacy files in: ${root}`)

  // 1. 删除老目录
  removeDirOrFile(path.join(root, "src/app/api/v1/admin/wms/warehouses"))
  removeDirOrFile(path.join(root, "src/app/api/v1/admin/wms/operations"))
  removeDirOrFile(path.join(root, "src/modules/wms/backend/services/warehouses.service.ts"))
  removeDirOrFile(path.join(root, "src/modules/wms/frontend/pages/warehouses.page.tsx"))

  // 2. 删除所有废弃的 [id] 子路由目录
  const wmsApiDir = path.join(root, "src/app/api/v1/admin/wms")
  if (fs.existsSync(wmsApiDir)) {
    const entries = fs.readdirSync(wmsApiDir, { withFileTypes: true })
    for (const ent of entries) {
      if (ent.isDirectory()) {
        const idPath = path.join(wmsApiDir, ent.name, "[id]")
        removeDirOrFile(idPath)
      }
    }
  }
}

console.log("[CLEAN-LEGACY] Complete! Legacy files wiped clean.")

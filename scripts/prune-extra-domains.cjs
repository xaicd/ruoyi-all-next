const fs = require("node:fs")
const path = require("node:path")

const sourceRoot = "d:/workspace/cw/agent-zqall"
const baseRepo = "D:/workspace/zhuangyuan/ruoyi/ruoyi-all-next"

// 待安全修剪的完全无关重工业与硬件模块
const DOMAINS_TO_PRUNE = [
  "wms",
  "mes",
  "erp",
  "crm",
  "iot",
  "im",
  "bpm",
  "mp",
  "report",
]

function removePath(relPath) {
  const full = path.join(sourceRoot, relPath)
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true })
    console.log(`  -> Removed: ${relPath}`)
    return 1
  }
  return 0
}

console.log("[PRUNE-DOMAINS] Starting safe pruning of non-relevant heavy industrial domains...")
console.log(`  Retained domains: system, infra, aigw, pay, mall, member, online, shared`)
console.log(`  Pruning domains: ${DOMAINS_TO_PRUNE.join(", ")}`)

let removedCount = 0

for (const domain of DOMAINS_TO_PRUNE) {
  // 1. 业务模块目录
  removedCount += removePath(`src/modules/${domain}`)
  // 2. API 路由目录
  removedCount += removePath(`src/app/api/v1/admin/${domain}`)
  // 3. Admin 页面入口目录
  removedCount += removePath(`src/app/(admin-pages)/admin/${domain}`)
  // 4. Clients 跨端多端目录
  removedCount += removePath(`clients/h5/src/modules/${domain}`)
  removedCount += removePath(`clients/uniapp/src/modules/${domain}`)
  removedCount += removePath(`clients/flutter/lib/modules/${domain}`)
}

// 清理临时脚本与缓存
removePath("test-codegen-e2e.ts")
removePath("scripts/scaffold-wms-domain.ts")
removePath("scripts/clean-wms-legacy.cjs")

console.log(`[PRUNE-DOMAINS] Complete! Successfully pruned ${removedCount} items. Project is now super clean, lean and fast!`)

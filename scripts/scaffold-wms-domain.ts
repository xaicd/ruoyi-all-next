import fs from "node:fs"
import path from "node:path"
import { CodegenEngineService } from "../packages/domains/infra/backend/services/codegen-engine.service"
import { WMS_TABLES } from "./data/wms-tables"



console.log(`[WMS-BATCH-CODEGEN] Starting batch scaffolding for ${WMS_TABLES.length} tables...`)
let totalFiles = 0

for (const cfg of WMS_TABLES) {
  const outputs = CodegenEngineService.generateCodes(cfg, { includeClients: true })
  for (const out of outputs) {
    const fullPath = path.resolve(process.cwd(), out.path)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, out.content, "utf-8")
    totalFiles++
  }
  console.log(`  -> Generated full-stack package for: ${cfg.className} (${cfg.businessName})`)
}

console.log(`[WMS-BATCH-CODEGEN] Successfully generated ${totalFiles} files across all ${WMS_TABLES.length} WMS tables.`)

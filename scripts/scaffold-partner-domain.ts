import fs from "node:fs"
import path from "node:path"
import { CodegenEngineService } from "../packages/domains/infra/backend/services/codegen-engine.service"
import { PARTNER_TABLES } from "./data/partner-tables"



console.log(`[PARTNER-CODEGEN] Generating code for ${PARTNER_TABLES.length} partner domain tables...`)
let totalFiles = 0

for (const cfg of PARTNER_TABLES) {
  const outputs = CodegenEngineService.generateCodes(cfg, { includeClients: true })
  for (const out of outputs) {
    const fullPath = path.resolve(process.cwd(), out.path)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, out.content, "utf-8")
    totalFiles++
  }
  console.log(`  -> Generated full-stack package for: ${cfg.className} (${cfg.businessName})`)
}

console.log(`[PARTNER-CODEGEN] Successfully generated ${totalFiles} files across all ${PARTNER_TABLES.length} tables.`)

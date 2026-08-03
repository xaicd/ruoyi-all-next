import { NextResponse } from "next/server"
import { zipSync, strToU8 } from "fflate"
import type { TemplateScaffoldResult } from "../../../../../../modules/infra/backend/services/template-engine.service"

export function buildTemplateEngineZipResponse(stack: string, data: TemplateScaffoldResult) {
  const archiveEntries: Record<string, Uint8Array> = {
    "manifest.json": strToU8(JSON.stringify(data, null, 2)),
  }
  for (const file of data.files) {
    archiveEntries[file.path] = strToU8(file.content)
  }
  const zipBuffer = zipSync(archiveEntries, { level: 6 })

  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${stack}-template.zip"`,
    },
  })
}
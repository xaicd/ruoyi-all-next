import { NextResponse } from "next/server"
import { infraCodegenExportSchema } from "@/backend/validators/infra.validator"
import { InfraTemplateEngineService } from "@/backend/services"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { buildTemplateEngineZipResponse } from "./template-engine-archive"

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_VIEW)
    const body = await request.json()
    const input = infraCodegenExportSchema.parse(body)
    const data = await InfraTemplateEngineService.generate(input)

    if (input.format === "zip") {
      return buildTemplateEngineZipResponse(input.stack, data)
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "导出失败" }, { status: 400 })
  }
}
import { NextResponse } from "next/server"
import { infraCodegenExportSchema } from "@/modules/infra/backend/validators"
import { InfraTemplateEngineService } from "@/modules/infra/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.INFRA_CODEGEN_UPDATE)
    const body = await request.json()
    const input = infraCodegenExportSchema.parse(body)
    const data = await InfraTemplateEngineService.exportCode(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "导出失败" }, { status: 400 })
  }
}

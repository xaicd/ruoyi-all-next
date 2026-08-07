import { NextResponse } from "next/server"
import { reportExportSchema } from "@/modules/report/backend/validators"
import { ReportService } from "@/modules/report/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.REPORT_EXPORT)
    const body = await request.json()
    const input = reportExportSchema.parse(body)
    const data = await ReportService.exportBoard(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "导出失败" }, { status: 400 })
  }
}

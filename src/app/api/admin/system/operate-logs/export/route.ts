import { NextResponse } from "next/server"
import { operateLogQuerySchema } from "@/backend/validators/system.validator"
import { SystemOperateLogService } from "@/backend/services/system-operate-log.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_OPERATE_LOG_EXPORT)
    const { searchParams } = new URL(request.url)
    const input = operateLogQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      module: searchParams.get("module") ?? undefined,
    })

    const data = await SystemOperateLogService.exportCsv(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "导出失败" }, { status: 400 })
  }
}

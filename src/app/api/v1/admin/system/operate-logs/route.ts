import { NextResponse } from "next/server"
import { operateLogQuerySchema } from "@/modules/system/backend/validators"
import { SystemOperateLogService } from "@/modules/system/backend/services/operate-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

/**
 * GET /api/admin/system/operate-logs
 * 操作日志列表（模板）
 */
export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_OPERATE_LOG_VIEW)
    const { searchParams } = new URL(request.url)
    const input = operateLogQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      module: searchParams.get("module") ?? undefined,
    })

    const data = await SystemOperateLogService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

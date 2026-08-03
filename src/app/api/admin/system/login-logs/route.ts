import { NextResponse } from "next/server"
import { loginLogQuerySchema } from "@/backend/validators/system.validator"
import { SystemLoginLogService } from "@/backend/services/system-login-log.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

/**
 * GET /api/admin/system/login-logs
 * 登录日志列表（模板）
 */
export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_LOGIN_LOG_VIEW)
    const { searchParams } = new URL(request.url)
    const input = loginLogQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      result: searchParams.get("result") ?? undefined,
    })

    const data = await SystemLoginLogService.list(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

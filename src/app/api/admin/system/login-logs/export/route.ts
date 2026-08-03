import { NextResponse } from "next/server"
import { loginLogQuerySchema } from "@/backend/validators/system.validator"
import { SystemLoginLogService } from "@/backend/services/system-login-log.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_LOGIN_LOG_EXPORT)
    const { searchParams } = new URL(request.url)
    const input = loginLogQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      result: searchParams.get("result") ?? undefined,
    })

    const data = await SystemLoginLogService.exportCsv(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "导出失败" }, { status: 400 })
  }
}

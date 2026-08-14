import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { loginLogQuerySchema } from "@/modules/system/backend/validators"
import { LoginLogService } from "@/modules/system/backend/services/login-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request, auth) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = loginLogQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      result: searchParams.get("result") ?? undefined,
    })

    const data = await LoginLogService.page(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "导出失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_LOGIN_LOG_EXPORT })

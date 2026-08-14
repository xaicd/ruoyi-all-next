import { loginLogQuerySchema } from "@/modules/system/backend/validators"
import { NextResponse } from "next/server"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { LoginLogService } from "@/modules/system/backend/services/login-log.service"

export const GET = withAdminRoute(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const input = loginLogQuerySchema.parse({
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? 20,
    keyword: searchParams.get("keyword") ?? undefined,
    result: searchParams.get("result") ?? undefined,
  })
  const data = await LoginLogService.page(input)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_LOGIN_LOG_QUERY })

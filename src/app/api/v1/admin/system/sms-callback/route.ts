import { NextResponse } from "next/server"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemSmsService } from "@/modules/system/backend/services"
import { systemModulePageQuerySchema } from "@/modules/system/backend/validators"

/**
 * Legacy route name notwithstanding, this endpoint is an administrator-only
 * SMS log query, not a provider callback receiver.
 */
export const GET = withAdminRoute(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const input = systemModulePageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
    })
    const data = await SystemSmsService.listLogs(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_SMS_LOG_QUERY })

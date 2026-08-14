import { operateLogQuerySchema } from "@/modules/system/backend/validators"
import { NextResponse } from "next/server"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { OperateLogService } from "@/modules/system/backend/services/operate-log.service"

export const GET = withAdminRoute(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const input = operateLogQuerySchema.parse({
    page: searchParams.get("page") ?? 1,
    pageSize: searchParams.get("pageSize") ?? 20,
    keyword: searchParams.get("keyword") ?? undefined,
    module: searchParams.get("module") ?? undefined,
  })
  const data = await OperateLogService.page(input)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_OPERATE_LOG_QUERY })

import { NextResponse } from "next/server"
import { ApiErrorLogService } from "@/modules/infra/backend/services/api-error-log.service"
import { apiErrorLogQuerySchema } from "@/modules/infra/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const input = apiErrorLogQuerySchema.parse({
    page: params.get("page") ?? 1,
    pageSize: params.get("pageSize") ?? 20,
    keyword: params.get("keyword") ?? undefined,
    status: params.get("status") ?? undefined,
  })
  return NextResponse.json({ success: true, data: await ApiErrorLogService.page(input) })
}, { permission: PERMISSIONS.INFRA_API_ERROR_LOG_VIEW })

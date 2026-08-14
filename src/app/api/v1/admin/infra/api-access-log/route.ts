import { NextResponse } from "next/server"
import { ApiAccessLogService } from "@/modules/infra/backend/services/api-access-log.service"
import { infraPageQuerySchema } from "@/modules/infra/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const input = infraPageQuerySchema.parse({
    page: params.get("page") ?? 1,
    pageSize: params.get("pageSize") ?? 20,
    keyword: params.get("keyword") ?? undefined,
  })
  return NextResponse.json({ success: true, data: await ApiAccessLogService.page(input) })
}, { permission: PERMISSIONS.INFRA_API_LOG_VIEW })

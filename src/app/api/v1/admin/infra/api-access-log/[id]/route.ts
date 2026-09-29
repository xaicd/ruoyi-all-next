import { NextResponse } from "next/server"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { ApiAccessLogService } from "@/modules/infra/backend/services/api-access-log.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await ApiAccessLogService.getApiAccessLog(parseActionBody(INFRA_ACTION_SCHEMAS["infra.getApiAccessLog"], { id }))
  if (!data) throw new ApiError("NOT_FOUND")
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_API_ACCESS_LOG_QUERY })

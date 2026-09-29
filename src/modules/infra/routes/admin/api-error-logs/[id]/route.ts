import { NextResponse } from "next/server"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { ApiErrorLogService } from "@/modules/infra/backend/services/api-error-log.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await ApiErrorLogService.getApiErrorLog(parseActionBody(INFRA_ACTION_SCHEMAS["infra.getApiErrorLog"], { id }))
  if (!data) throw new ApiError("NOT_FOUND")
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_API_ERROR_LOG_QUERY })

export const PATCH = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { id } = await context.params
  const body = await request.json()
  const input = parseActionBody(INFRA_ACTION_SCHEMAS["infra.processApiErrorLog"], {
    id,
    processedBy: auth.userId,
    processNote: body.processNote,
  })
  const data = await ApiErrorLogService.processApiErrorLog(input)
  if (!data.success) throw new ApiError("NOT_FOUND")
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_API_ERROR_LOG_UPDATE_STATUS })

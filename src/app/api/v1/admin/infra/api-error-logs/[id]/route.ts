import { NextResponse } from "next/server"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { ApiErrorLogService } from "@/modules/infra/backend/services/api-error-log.service"
import { apiErrorLogProcessSchema } from "@/modules/infra/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await ApiErrorLogService.get(id)
  if (!data) throw new ApiError("NOT_FOUND")
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_API_ERROR_LOG_QUERY })

export const PATCH = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { id } = await context.params
  const body = apiErrorLogProcessSchema.parse(await request.json())
  const data = await ApiErrorLogService.markProcessed(id, { processedBy: auth.userId, processNote: body.processNote })
  if (!data.success) throw new ApiError("NOT_FOUND")
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_API_ERROR_LOG_UPDATE_STATUS })

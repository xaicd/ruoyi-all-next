import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { updateOnlineRuntimeRecordSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ code: string; sessionId: string; recordId: string }> }

export const PUT = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { code, sessionId, recordId } = await context.params
  const input = updateOnlineRuntimeRecordSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.updateTestRecord(auth, code, sessionId, recordId, input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_TEST })

export const DELETE = withAdminRoute(async (_request, auth, context: RouteContext) => {
  const { code, sessionId, recordId } = await context.params
  await OnlineDefinitionService.deleteTestRecord(auth, code, sessionId, recordId)
  return NextResponse.json({ success: true })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_TEST })

import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ code: string; sessionId: string }> }

export const GET = withAdminRoute(async (_request, auth, context: RouteContext) => {
  const { code, sessionId } = await context.params
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.getTestSession(auth, code, sessionId) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_TEST })

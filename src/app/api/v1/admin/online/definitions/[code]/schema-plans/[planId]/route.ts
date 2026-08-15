import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ code: string; planId: string }> }

export const GET = withAdminRoute(async (_request, auth, context: RouteContext) => {
  const { code, planId } = await context.params
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.getSchemaPlan(auth, code, planId) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_QUERY })

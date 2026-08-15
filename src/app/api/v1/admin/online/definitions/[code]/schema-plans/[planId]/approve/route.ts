import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { approveOnlineSchemaPlanSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ code: string; planId: string }> }

export const POST = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { code, planId } = await context.params
  const input = approveOnlineSchemaPlanSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.approveSchemaPlan(auth, code, planId, input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_MIGRATE })

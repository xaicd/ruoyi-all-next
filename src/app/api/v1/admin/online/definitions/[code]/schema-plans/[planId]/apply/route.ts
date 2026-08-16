import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { applyOnlineSchemaPlanSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ code: string; planId: string }> }

/** Applies only a server-built, already-approved MANAGED_TABLE plan after explicit acknowledgement. */
export const POST = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { code, planId } = await context.params
  const input = applyOnlineSchemaPlanSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.applySchemaPlan(auth, code, planId, input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_MIGRATE })

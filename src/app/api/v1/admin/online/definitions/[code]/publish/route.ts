import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { publishOnlineRevisionSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ code: string }> }

export const POST = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { code } = await context.params
  const input = publishOnlineRevisionSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.publish(auth, code, input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_PUBLISH })

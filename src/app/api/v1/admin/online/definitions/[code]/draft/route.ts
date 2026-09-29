import { NextResponse } from "next/server"
import { OnlineDefinitionService } from "@/modules/online/backend/services"
import { updateOnlineRevisionSchema } from "@/modules/online/backend/validators"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

type RouteContext = { params: Promise<{ code: string }> }

export const PUT = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { code } = await context.params
  const input = updateOnlineRevisionSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await OnlineDefinitionService.updateDraft(auth, code, input) })
}, { permission: PERMISSIONS.INFRA_ONLINE_DEFINITION_UPDATE })

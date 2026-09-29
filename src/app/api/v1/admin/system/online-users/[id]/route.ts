import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemOnlineUserService } from "@/modules/system/backend/services/online-user.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const DELETE = withAdminRoute(async (_request, auth, context: RouteContext) => {
  const { id } = await context.params
  const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.forceLogoutOnlineUser"], { sessionId: id })
  return NextResponse.json({ success: true, data: await SystemOnlineUserService.forceLogoutOnlineUser({ ...input, operatorId: auth.userId }) })
}, { permission: PERMISSIONS.SYSTEM_ONLINE_USER_FORCE_LOGOUT })

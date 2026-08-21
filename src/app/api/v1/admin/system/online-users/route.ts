import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemOnlineUserService } from "@/modules/system/backend/services/online-user.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemOnlineUserService.listOnlineUsers(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listOnlineUsers"], request)) })
}, { permission: PERMISSIONS.SYSTEM_ONLINE_USER_VIEW })

export const POST = withAdminRoute(async (request, auth) => {
  const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.forceLogoutOnlineUser"], await request.json())
  return NextResponse.json({ success: true, data: await SystemOnlineUserService.forceLogoutOnlineUser({ ...input, operatorId: auth.userId }) })
}, { permission: PERMISSIONS.SYSTEM_ONLINE_USER_FORCE_LOGOUT })

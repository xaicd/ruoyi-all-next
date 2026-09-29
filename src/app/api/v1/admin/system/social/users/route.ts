import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemSocialService } from "@/modules/system/backend/services/social.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemSocialService.listUsers(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listSocialUsers"], request)) })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_USER_VIEW })

export const POST = withAdminRoute(async (request, auth) => {
  const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createSocialUser"], await request.json())
  return NextResponse.json({ success: true, data: await SystemSocialService.createSocialUser({ ...input, operatorId: auth.userId }) })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_USER_CREATE })

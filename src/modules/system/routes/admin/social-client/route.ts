import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemSocialClientService } from "@/modules/system/backend/services/social-client.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemSocialClientService.listSocialClients(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listSocialClients"], request)) })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_CLIENT_QUERY })

export const POST = withAdminRoute(async (request) => {
  const data = await SystemSocialClientService.createSocialClient(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createSocialClient"], await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_CLIENT_UPDATE })

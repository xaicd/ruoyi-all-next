import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemSocialClientService } from "@/modules/system/backend/services/social-client.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemSocialClientService.getSocialClient(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getSocialClient"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_CLIENT_QUERY })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await SystemSocialClientService.updateSocialClient(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateSocialClient"], { ...await request.json(), id }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_CLIENT_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemSocialClientService.deleteSocialClient(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteSocialClient"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_SOCIAL_CLIENT_DELETE })

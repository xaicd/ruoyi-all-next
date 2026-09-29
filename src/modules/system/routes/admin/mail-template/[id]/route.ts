import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemMailTemplateService } from "@/modules/system/backend/services/mail-template.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemMailTemplateService.getMailTemplate(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getMailTemplate"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_MAIL_TEMPLATE_QUERY })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await SystemMailTemplateService.updateMailTemplate(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateMailTemplate"], { ...await request.json(), id }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_MAIL_TEMPLATE_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemMailTemplateService.deleteMailTemplate(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteMailTemplate"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_MAIL_TEMPLATE_DELETE })

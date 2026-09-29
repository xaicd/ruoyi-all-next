import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemSmsTemplateService } from "@/modules/system/backend/services/sms-template.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemSmsTemplateService.getSmsTemplate(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getSmsTemplate"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_SMS_TEMPLATE_QUERY })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await SystemSmsTemplateService.updateSmsTemplate(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateSmsTemplate"], { ...await request.json(), id }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_SMS_TEMPLATE_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await SystemSmsTemplateService.deleteSmsTemplate(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteSmsTemplate"], { id })) })
}, { permission: PERMISSIONS.SYSTEM_SMS_TEMPLATE_DELETE })

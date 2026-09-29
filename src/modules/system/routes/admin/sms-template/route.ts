import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemSmsTemplateService } from "@/modules/system/backend/services/sms-template.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemSmsTemplateService.listSmsTemplates(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listSmsTemplates"], request)) })
}, { permission: PERMISSIONS.SYSTEM_SMS_TEMPLATE_QUERY })

export const POST = withAdminRoute(async (request) => {
  const data = await SystemSmsTemplateService.createSmsTemplate(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createSmsTemplate"], await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_SMS_TEMPLATE_UPDATE })

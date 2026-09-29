import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemMailTemplateService } from "@/modules/system/backend/services/mail-template.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemMailTemplateService.listMailTemplates(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listMailTemplates"], request)) })
}, { permission: PERMISSIONS.SYSTEM_MAIL_TEMPLATE_QUERY })

export const POST = withAdminRoute(async (request) => {
  const data = await SystemMailTemplateService.createMailTemplate(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createMailTemplate"], await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}, { permission: PERMISSIONS.SYSTEM_MAIL_TEMPLATE_UPDATE })

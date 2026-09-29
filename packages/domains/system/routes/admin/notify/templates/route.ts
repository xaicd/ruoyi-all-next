import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { NotifyTemplateService } from "@/modules/system/backend/services/notify-template.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await NotifyTemplateService.page(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.pageNotifyTemplates"], request)) })
}, { permission: PERMISSIONS.SYSTEM_NOTIFY_TEMPLATE_VIEW })

export const POST = withAdminRoute(async (request) => {
  const data = await NotifyTemplateService.create(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createNotifyTemplate"], await request.json()))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_NOTIFY_TEMPLATE_CREATE })

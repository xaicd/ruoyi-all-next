import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemSmsService } from "@/modules/system/backend/services/sms.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemSmsService.listChannels(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listSmsChannels"], request)) })
}, { permission: PERMISSIONS.SYSTEM_SMS_CHANNEL_VIEW })

export const POST = withAdminRoute(async (request, auth) => {
  const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createSmsChannel"], await request.json())
  return NextResponse.json({ success: true, data: await SystemSmsService.createSmsChannel({ ...input, operatorId: auth.userId }) })
}, { permission: PERMISSIONS.SYSTEM_SMS_CHANNEL_CREATE })

import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { NotifyMessageService } from "@/modules/system/backend/services/notify-message.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await NotifyMessageService.page(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.pageNotifyMessages"], request)) })
}, { permission: PERMISSIONS.SYSTEM_NOTIFY_MESSAGE_VIEW })

export const POST = withAdminRoute(async (request) => {
  const data = await NotifyMessageService.create(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createNotifyMessage"], await request.json()))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_NOTIFY_MESSAGE_CREATE })

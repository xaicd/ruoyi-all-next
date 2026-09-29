import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemMailService } from "@/modules/system/backend/services/mail.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemMailService.listLogs(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listMailLogs"], request)) })
}, { permission: PERMISSIONS.SYSTEM_MAIL_LOG_VIEW })

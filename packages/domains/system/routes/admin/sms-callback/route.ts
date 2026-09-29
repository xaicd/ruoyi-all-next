import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemSmsService } from "@/modules/system/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

/** Legacy route name: administrator SMS log query, not a provider callback. */
export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await SystemSmsService.listLogs(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.listSmsLogs"], request)) })
}, { permission: PERMISSIONS.SYSTEM_SMS_LOG_QUERY })

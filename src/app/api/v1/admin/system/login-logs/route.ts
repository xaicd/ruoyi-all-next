import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { LoginLogService } from "@/modules/system/backend/services/login-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await LoginLogService.page(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.pageLoginLogs"], request)) })
}, { permission: PERMISSIONS.SYSTEM_LOGIN_LOG_QUERY })

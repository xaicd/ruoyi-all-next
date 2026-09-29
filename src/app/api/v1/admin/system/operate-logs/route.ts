import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { OperateLogService } from "@/modules/system/backend/services/operate-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  return NextResponse.json({ success: true, data: await OperateLogService.page(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.pageOperateLogs"], request)) })
}, { permission: PERMISSIONS.SYSTEM_OPERATE_LOG_QUERY })

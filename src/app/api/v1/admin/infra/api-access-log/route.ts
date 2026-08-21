import { NextResponse } from "next/server"
import { ApiAccessLogService } from "@/modules/infra/backend/services/api-access-log.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.pageApiAccessLogs"], request)
  return NextResponse.json({ success: true, data: await ApiAccessLogService.page(input) })
}, { permission: PERMISSIONS.INFRA_API_ACCESS_LOG_QUERY })

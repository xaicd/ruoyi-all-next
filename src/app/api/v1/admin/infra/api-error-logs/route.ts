import { NextResponse } from "next/server"
import { ApiErrorLogService } from "@/modules/infra/backend/services/api-error-log.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.pageApiErrorLogs"], request)
  return NextResponse.json({ success: true, data: await ApiErrorLogService.page(input) })
}, { permission: PERMISSIONS.INFRA_API_ERROR_LOG_QUERY })

import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { csvResponse } from "@/modules/shared/backend/http/csv-download"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { ApiAccessLogService } from "@/modules/infra/backend/services/api-access-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.exportApiAccessLogs"], request)
  const rows = await ApiAccessLogService.exportApiAccessLogs({ ...input, page: 1, pageSize: 10_000 })
  return csvResponse("api-access-logs.csv", ["Trace ID", "方法", "路径", "状态", "耗时(ms)", "用户", "租户", "IP", "操作", "时间"], rows.map((row) => [row.traceId, row.requestMethod, row.requestUrl, row.resultCode, row.duration, row.userId, row.tenantId, row.userIp, row.operation, row.createdAt]))
}, { permission: PERMISSIONS.INFRA_API_ACCESS_LOG_EXPORT })

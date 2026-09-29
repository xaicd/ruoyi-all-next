import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { csvResponse } from "@/modules/shared/backend/http/csv-download"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { ApiErrorLogService } from "@/modules/infra/backend/services/api-error-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.exportApiErrorLogs"], request)
  const rows = await ApiErrorLogService.exportApiErrorLogs({ ...input, page: 1, pageSize: 10_000 })
  return csvResponse("api-error-logs.csv", ["Trace ID", "错误码", "异常", "消息", "状态", "处理人", "处理时间", "处理说明", "路径", "时间"], rows.map((row) => [row.traceId, row.errorCode, row.exceptionName, row.exceptionMessage, row.status, row.processedBy, row.processedAt, row.processNote, row.requestUrl, row.createdAt]))
}, { permission: PERMISSIONS.INFRA_API_ERROR_LOG_EXPORT })

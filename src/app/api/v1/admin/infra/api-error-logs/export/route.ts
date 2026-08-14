import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { csvResponse } from "@/modules/shared/backend/http/csv-download"
import { apiErrorLogQuerySchema } from "@/modules/infra/backend/validators"
import { ApiErrorLogService } from "@/modules/infra/backend/services/api-error-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const input = apiErrorLogQuerySchema.parse({ page: 1, pageSize: 100, keyword: params.get("keyword") ?? undefined, status: params.get("status") ?? undefined })
  const rows = await ApiErrorLogService.exportRows(input)
  return csvResponse("api-error-logs.csv", ["Trace ID", "错误码", "异常", "消息", "状态", "处理人", "处理时间", "处理说明", "路径", "时间"], rows.map((row) => [row.traceId, row.errorCode, row.exceptionName, row.exceptionMessage, row.status, row.processedBy, row.processedAt, row.processNote, row.requestUrl, row.createdAt]))
}, { permission: PERMISSIONS.INFRA_API_ERROR_LOG_EXPORT })

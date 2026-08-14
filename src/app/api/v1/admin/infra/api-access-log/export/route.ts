import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { csvResponse } from "@/modules/shared/backend/http/csv-download"
import { infraPageQuerySchema } from "@/modules/infra/backend/validators"
import { ApiAccessLogService } from "@/modules/infra/backend/services/api-access-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const input = infraPageQuerySchema.parse({ page: 1, pageSize: 100, keyword: params.get("keyword") ?? undefined })
  const rows = await ApiAccessLogService.exportRows(input)
  return csvResponse("api-access-logs.csv", ["Trace ID", "方法", "路径", "状态", "耗时(ms)", "用户", "租户", "IP", "操作", "时间"], rows.map((row) => [row.traceId, row.requestMethod, row.requestUrl, row.resultCode, row.duration, row.userId, row.tenantId, row.userIp, row.operation, row.createdAt]))
}, { permission: PERMISSIONS.INFRA_API_ACCESS_LOG_EXPORT })

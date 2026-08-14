import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { csvResponse } from "@/modules/shared/backend/http/csv-download"
import { loginLogQuerySchema } from "@/modules/system/backend/validators"
import { LoginLogService } from "@/modules/system/backend/services/login-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const input = loginLogQuerySchema.parse({ page: 1, pageSize: 100, keyword: params.get("keyword") ?? undefined, result: params.get("result") ?? undefined })
  const rows = await LoginLogService.exportRows(input)
  return csvResponse("login-logs.csv", ["ID", "用户名", "结果", "IP", "租户", "说明", "时间"], rows.map((row) => [row.id, row.username, row.result, row.userIp, row.tenantId, row.remark, row.createdAt]))
}, { permission: PERMISSIONS.SYSTEM_LOGIN_LOG_EXPORT })

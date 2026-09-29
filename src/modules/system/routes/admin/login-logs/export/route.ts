import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { csvResponse } from "@/modules/shared/backend/http/csv-download"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { LoginLogService } from "@/modules/system/backend/services/login-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.exportLoginLogs"], request)
  const rows = await LoginLogService.exportLoginLogs({ ...input, page: 1, pageSize: 10_000 })
  return csvResponse("login-logs.csv", ["ID", "用户名", "结果", "IP", "租户", "说明", "时间"], rows.map((row) => [row.id, row.username, row.result, row.userIp, row.tenantId, row.remark, row.createdAt]))
}, { permission: PERMISSIONS.SYSTEM_LOGIN_LOG_EXPORT })

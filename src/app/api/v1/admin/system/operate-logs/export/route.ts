import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { csvResponse } from "@/modules/shared/backend/http/csv-download"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { OperateLogService } from "@/modules/system/backend/services/operate-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const input = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.exportOperateLogs"], request)
  const rows = await OperateLogService.exportOperateLogs({ ...input, page: 1, pageSize: 10_000 })
  return csvResponse("operate-logs.csv", ["ID", "模块", "操作", "类型", "方法", "路径", "状态", "耗时(ms)", "IP", "时间"], rows.map((row) => [row.id, row.module, row.name, row.type, row.requestMethod, row.requestUrl, row.resultCode, row.duration, row.userIp, row.createdAt]))
}, { permission: PERMISSIONS.SYSTEM_OPERATE_LOG_EXPORT })

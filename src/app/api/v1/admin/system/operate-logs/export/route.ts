import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { csvResponse } from "@/modules/shared/backend/http/csv-download"
import { operateLogQuerySchema } from "@/modules/system/backend/validators"
import { OperateLogService } from "@/modules/system/backend/services/operate-log.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request) => {
  const params = new URL(request.url).searchParams
  const input = operateLogQuerySchema.parse({ page: 1, pageSize: 100, keyword: params.get("keyword") ?? undefined, module: params.get("module") ?? undefined })
  const rows = await OperateLogService.exportRows(input)
  return csvResponse("operate-logs.csv", ["ID", "模块", "操作", "类型", "方法", "路径", "状态", "耗时(ms)", "IP", "时间"], rows.map((row) => [row.id, row.module, row.name, row.type, row.requestMethod, row.requestUrl, row.resultCode, row.duration, row.userIp, row.createdAt]))
}, { permission: PERMISSIONS.SYSTEM_OPERATE_LOG_EXPORT })

import { NextResponse } from "next/server"
import { CustomSqlReportService } from "@/modules/report/backend/services/custom-sql-report.service"
import { executeCustomSqlReportSchema } from "@/modules/report/backend/validators/custom-sql-report.validator"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const POST = withAdminRoute(async (request, auth) => {
  if (!auth.tenantId) throw new ApiError("FORBIDDEN", "AUTO报表必须在租户上下文中使用")
  const input = executeCustomSqlReportSchema.parse(await request.json())
  return NextResponse.json({ success: true, data: await CustomSqlReportService.execute(auth.tenantId, input) })
}, { permission: PERMISSIONS.REPORT_CUSTOM_SQL_EXECUTE })
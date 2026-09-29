import { NextResponse } from "next/server"
import { CustomSqlReportService } from "@/modules/report/backend/services/custom-sql-report.service"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const GET = withAdminRoute(async (_request, auth) => {
  if (!auth.tenantId) throw new ApiError("FORBIDDEN", "AUTO报表必须在租户上下文中使用")
  return NextResponse.json({ success: true, data: await CustomSqlReportService.dataSources(auth.tenantId) })
}, { permission: PERMISSIONS.REPORT_CUSTOM_SQL_EXECUTE })
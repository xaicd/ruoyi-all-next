import { NextResponse } from "next/server"
import { CodegenTableService } from "@/modules/infra/backend/services/codegen-table.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

export const POST = withAdminRoute(async (request, auth) => {
  if (!auth.tenantId) throw new ApiError("FORBIDDEN", "Online 设计表必须在租户上下文中导入")
  const input = parseActionBody(INFRA_ACTION_SCHEMAS["infra.importCodegenTables"], { ...await request.json(), tenantId: auth.tenantId })
  const data = await CodegenTableService.importCodegenTables(input)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_CREATE })

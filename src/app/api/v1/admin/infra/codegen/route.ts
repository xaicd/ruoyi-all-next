import { NextResponse } from "next/server"
import { CodegenTableService } from "@/modules/infra/backend/services/codegen-table.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request, auth) => {
  const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.listCodegenTables"], request)
  const data = await CodegenTableService.listCodegenTables({ ...input, tenantId: input.tenantId ?? auth.tenantId })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_QUERY })

export const DELETE = withAdminRoute(async (request, auth) => {
  const input = parseActionQuery(INFRA_ACTION_SCHEMAS["infra.deleteCodegenTables"], request)
  const data = await CodegenTableService.deleteCodegenTables({ ...input, tenantId: input.tenantId ?? auth.tenantId })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_DELETE })

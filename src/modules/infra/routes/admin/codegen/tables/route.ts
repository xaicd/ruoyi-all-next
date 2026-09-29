import { NextResponse } from "next/server"
import { CodegenTableService } from "@/modules/infra/backend/services/codegen-table.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

export const GET = withAdminRoute(async (request, auth) => {
  if (!auth.tenantId) throw new ApiError("FORBIDDEN", "Online 设计表必须在租户上下文中选择")
  const query = Object.fromEntries(new URL(request.url).searchParams)
  const input = parseActionBody(INFRA_ACTION_SCHEMAS["infra.listCodegenCandidates"], { ...query, tenantId: auth.tenantId })
  const data = await CodegenTableService.listCodegenCandidates({ ...input, tenantId: auth.tenantId })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_QUERY })

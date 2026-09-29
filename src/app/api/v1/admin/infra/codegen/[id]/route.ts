import { NextResponse } from "next/server"
import { CodegenTableService } from "@/modules/infra/backend/services/codegen-table.service"
import { INFRA_ACTION_SCHEMAS } from "@/modules/infra/contract/actions"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await CodegenTableService.getCodegenTable(parseActionBody(INFRA_ACTION_SCHEMAS["infra.getCodegenTable"], { id, tenantId: auth.tenantId }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_QUERY })

export const PUT = withAdminRoute(async (request, auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await CodegenTableService.updateCodegenTable(parseActionBody(INFRA_ACTION_SCHEMAS["infra.updateCodegenTable"], { ...await request.json(), id, tenantId: auth.tenantId }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_UPDATE })

export const DELETE = withAdminRoute(async (_request, auth, context: RouteContext) => {
  const { id } = await context.params
  const data = await CodegenTableService.deleteCodegenTable(parseActionBody(INFRA_ACTION_SCHEMAS["infra.deleteCodegenTable"], { id, tenantId: auth.tenantId }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.INFRA_CODEGEN_DELETE })

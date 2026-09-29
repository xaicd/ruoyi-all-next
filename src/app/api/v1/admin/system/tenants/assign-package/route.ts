import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const POST = withAdminRoute(async (request, auth) => {
  const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.assignTenantPackage"], await request.json())
  const data = await SystemTenantService.assignTenantPackage({ ...input, operatorId: auth.userId })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_TENANT_ASSIGN_PACKAGE, platformOnly: true })

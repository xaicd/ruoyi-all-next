import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const POST = withAdminRoute(async (request) => {
  const body = await request.json() as { tenantId?: string; status?: string }
  const data = await SystemTenantService.updateTenantStatus(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateTenantStatus"], { id: body.tenantId, status: body.status }))
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_TENANT_UPDATE_STATUS, platformOnly: true })

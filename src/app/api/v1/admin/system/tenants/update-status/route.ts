import { NextResponse } from "next/server"
import { updateTenantStatusSchema } from "@/modules/system/backend/validators"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const POST = withAdminRoute(async (request) => {
  const input = updateTenantStatusSchema.parse(await request.json())
  const data = await SystemTenantService.updateStatus(input.tenantId, input.status)
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_TENANT_UPDATE_STATUS, platformOnly: true })

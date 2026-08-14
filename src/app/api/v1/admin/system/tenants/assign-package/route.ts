import { NextResponse } from "next/server"
import { assignTenantPackageSchema } from "@/modules/system/backend/validators"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"

export const POST = withAdminRoute(async (request, auth) => {
  const input = assignTenantPackageSchema.parse(await request.json())
  if (!input.tenantId || !input.packageId) {
    return NextResponse.json({ success: false, error: "tenantId 和 packageId 不能为空" }, { status: 400 })
  }
  const data = await SystemTenantService.assignPackage(auth.userId, { tenantId: input.tenantId, packageId: input.packageId })
  return NextResponse.json({ success: true, data })
}, { permission: PERMISSIONS.SYSTEM_TENANT_ASSIGN_PACKAGE, platformOnly: true })

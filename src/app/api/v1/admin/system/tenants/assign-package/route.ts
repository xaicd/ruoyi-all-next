import { NextResponse } from "next/server"
import { assignTenantPackageSchema } from "@/modules/system/backend/validators"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getAuthErrorStatus, requirePlatformAdmin } from "@/modules/shared/backend/auth/guards"

export async function POST(request: Request) {
  try {
    const auth = requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_ASSIGN_PACKAGE)
    const input = assignTenantPackageSchema.parse(await request.json()) as any
    const data = await SystemTenantService.assignPackage(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: getAuthErrorStatus(error) })
  }
}

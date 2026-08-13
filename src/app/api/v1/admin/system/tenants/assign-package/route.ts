import { NextResponse } from "next/server"
import { assignTenantPackageSchema } from "@/modules/system/backend/validators"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_TENANT_ASSIGN_PACKAGE)
    const body = await request.json()
    const input = assignTenantPackageSchema.parse(body) as any
    const data = await SystemTenantService.assignPackage(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}

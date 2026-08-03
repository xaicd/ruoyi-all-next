import { NextResponse } from "next/server"
import { assignTenantPackageSchema } from "@/backend/validators/system.validator"
import { SystemTenantService } from "@/backend/services/system-tenant.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_TENANT_ASSIGN_PACKAGE)
    const body = await request.json()
    const input = assignTenantPackageSchema.parse(body)

    const data = await SystemTenantService.assignPackage(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}

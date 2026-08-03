import { NextResponse } from "next/server"
import { updateTenantStatusSchema } from "@/backend/validators/system.validator"
import { SystemTenantService } from "@/backend/services/system-tenant.service"
import { PERMISSIONS } from "@/backend/constants/permissions"
import { ensurePermission } from "@/backend/lib/permission-guard"

export async function POST(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_TENANT_UPDATE_STATUS)
    const body = await request.json()
    const input = updateTenantStatusSchema.parse(body)

    const data = await SystemTenantService.updateStatus(auth.userId, input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: 400 })
  }
}

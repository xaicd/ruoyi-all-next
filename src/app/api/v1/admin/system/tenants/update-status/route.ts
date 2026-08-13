import { NextResponse } from "next/server"
import { updateTenantStatusSchema } from "@/modules/system/backend/validators"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getAuthErrorStatus, requirePlatformAdmin } from "@/modules/shared/backend/auth/guards"

export async function POST(request: Request) {
  try {
    await requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_UPDATE_STATUS)
    const input = updateTenantStatusSchema.parse(await request.json())
    const data = await SystemTenantService.updateStatus(input.tenantId, input.status)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "操作失败" }, { status: getAuthErrorStatus(error) })
  }
}

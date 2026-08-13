import { NextResponse } from "next/server"
import { SystemTenantService } from "@/modules/system/backend/services/tenant.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getAuthErrorStatus, requirePlatformAdmin } from "@/modules/shared/backend/auth/guards"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  try {
    await requirePlatformAdmin(request, PERMISSIONS.SYSTEM_TENANT_VIEW)
    const { id } = await context.params
    return NextResponse.json({ success: true, data: await SystemTenantService.getSubscriptionHistory(id) })
  } catch (error: any) {
    const status = getAuthErrorStatus(error) || (error?.message?.includes("不存在") ? 404 : 400)
    return NextResponse.json({ success: false, error: error?.message ?? "查询订阅历史失败" }, { status })
  }
}

import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export const GET = withAdminRoute(async (request, auth) => {
  try {
    const data = await SystemAuthService.getPermissionInfo(auth.userId)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_USER_VIEW })

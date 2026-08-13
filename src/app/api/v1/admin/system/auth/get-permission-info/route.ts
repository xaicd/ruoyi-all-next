import { NextResponse } from "next/server"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

export async function GET(request: Request) {
  try {
    const auth = await ensurePermission(request, PERMISSIONS.SYSTEM_USER_VIEW)
    const data = await SystemAuthService.getPermissionInfo(auth.userId)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

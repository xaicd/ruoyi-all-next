import { NextResponse } from "next/server"
import { SystemAuthService } from "@/backend/services/system-auth.service"
import { ensurePermission } from "@/backend/lib/permission-guard"
import { PERMISSIONS } from "@/backend/constants/permissions"

export async function GET(request: Request) {
  try {
    const auth = ensurePermission(request, PERMISSIONS.SYSTEM_USER_VIEW)
    const data = await SystemAuthService.getPermissionInfo(auth.userId)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

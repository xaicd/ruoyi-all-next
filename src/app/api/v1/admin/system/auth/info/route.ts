import { NextResponse } from "next/server"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"

/**
 * GET /api/v1/admin/system/auth/info
 * 获取当前登录用户权限信息（需要 Bearer token）
 */
export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "未登录" }, { status: 401 })
    }

    const payload = await SystemAuthService.verifyToken(token)
    const data = await SystemAuthService.getPermissionInfo(payload.sub)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("expired") ? 401 : 400
    return NextResponse.json({ success: false, error: error?.message ?? "获取失败" }, { status })
  }
}

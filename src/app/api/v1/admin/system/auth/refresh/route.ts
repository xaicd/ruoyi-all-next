import { NextResponse } from "next/server"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"

/**
 * POST /api/v1/admin/system/auth/refresh
 * 刷新 token
 */
export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "未登录" }, { status: 401 })
    }

    const data = await SystemAuthService.refreshToken(token)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "刷新失败" }, { status: 401 })
  }
}

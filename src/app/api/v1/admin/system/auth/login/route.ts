import { NextResponse } from "next/server"
import { loginSchema } from "@/modules/system/backend/validators"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"

/**
 * POST /api/v1/admin/system/auth/login
 * 管理后台登录
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = loginSchema.parse(body)
    const data = await SystemAuthService.login(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("禁用") ? 403 : 401
    return NextResponse.json({ success: false, error: error?.message ?? "登录失败" }, { status })
  }
}

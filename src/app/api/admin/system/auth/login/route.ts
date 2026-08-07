import { NextResponse } from "next/server"
import { loginSchema } from "@/modules/system/backend/validators"
import { SystemAuthService } from "@/modules/system/backend/services/auth.service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = loginSchema.parse(body)
    const data = await SystemAuthService.login(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "登录失败" }, { status: 400 })
  }
}

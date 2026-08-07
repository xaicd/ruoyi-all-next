import { NextResponse } from "next/server"
import { captchaVerifySchema } from "@/modules/system/backend/validators"
import { SystemCaptchaService } from "@/modules/system/backend/services/captcha.service"

export async function GET() {
  try {
    const data = await SystemCaptchaService.generate()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "获取验证码失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const input = captchaVerifySchema.parse(body)
    const data = await SystemCaptchaService.verify(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "校验验证码失败" }, { status: 400 })
  }
}

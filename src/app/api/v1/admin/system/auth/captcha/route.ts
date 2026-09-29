import { NextResponse } from "next/server"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemCaptchaService } from "@/modules/system/backend/services/captcha.service"
import { handleApiError } from "@/modules/shared/backend/http/api-error"

export async function GET() {
  try {
    const data = await SystemCaptchaService.generateCaptcha(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.generateCaptcha"], {}))
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return handleApiError(error, { operation: "GET /api/v1/admin/system/auth/captcha" })
  }
}

export async function POST(request: Request) {
  try {
    const data = await SystemCaptchaService.verifyCaptcha(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.verifyCaptcha"], await request.json()))
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return handleApiError(error, { operation: "POST /api/v1/admin/system/auth/captcha" })
  }
}

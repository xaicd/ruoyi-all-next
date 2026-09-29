import { NextResponse } from "next/server"
import { MemberAuthService } from "@/modules/member/backend/services/member-auth.service"
import { memberRegisterSchema } from "@/modules/member/backend/validators/member-auth.validators"
import { handleApiError } from "@/modules/shared/backend/http/api-error"

/** C 端会员注册（账号密码，无需登录） POST /api/v1/app/member/auth/register */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const input = memberRegisterSchema.parse(body)
    const member = await MemberAuthService.register(input)
    return NextResponse.json({ success: true, data: member })
  } catch (error) {
    return handleApiError(error, { request })
  }
}

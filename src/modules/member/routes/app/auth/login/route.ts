import { NextResponse } from "next/server"
import { MemberAuthService } from "@/modules/member/backend/services/member-auth.service"
import { memberLoginSchema } from "@/modules/member/backend/validators/member-auth.validators"
import { handleApiError } from "@/modules/shared/backend/http/api-error"

/** C 端会员登录 POST /api/v1/app/member/auth/login → { token, expiresIn, member } */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const input = memberLoginSchema.parse(body)
    const result = await MemberAuthService.login(input)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return handleApiError(error, { request })
  }
}

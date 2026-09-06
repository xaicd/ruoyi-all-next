import { NextResponse } from "next/server"
import { MemberAuthService } from "@/modules/member/backend/services/member-auth.service"
import { withAppRoute } from "@/modules/shared/backend/http/app-route"

/** C 端会员登出 POST /api/v1/app/member/auth/logout（需登录） */
export const POST = withAppRoute(async (_request, auth) => {
  const result = await MemberAuthService.logout(auth.memberId ?? auth.userId)
  return NextResponse.json({ success: true, data: result })
})

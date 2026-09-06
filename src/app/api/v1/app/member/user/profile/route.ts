import { NextResponse } from "next/server"
import { MemberProfileService } from "@/modules/member/backend/services/member-profile.service"
import { memberProfileUpdateSchema } from "@/modules/member/backend/validators/member-auth.validators"
import { withAppRoute } from "@/modules/shared/backend/http/app-route"

/** 会员个人中心 GET /api/v1/app/member/user/profile（需登录） */
export const GET = withAppRoute(async (_request, auth) => {
  const member = await MemberProfileService.getProfile(auth.memberId ?? auth.userId)
  return NextResponse.json({ success: true, data: member })
})

/** 更新会员资料 PUT /api/v1/app/member/user/profile（昵称/头像，不含账号密码） */
export const PUT = withAppRoute(async (request, auth) => {
  const body = await request.json().catch(() => ({}))
  const input = memberProfileUpdateSchema.parse(body)
  const member = await MemberProfileService.updateProfile(auth.memberId ?? auth.userId, input)
  return NextResponse.json({ success: true, data: member })
})

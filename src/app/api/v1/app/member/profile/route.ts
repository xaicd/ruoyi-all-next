import { NextResponse } from "next/server"
import { requireAppLogin } from "@/modules/shared/backend/lib/app-auth-guard"
import { getAuthErrorStatus } from "@/modules/shared/backend/auth/guards"

/**
 * 会员个人中心 - 需要登录
 * GET /api/v1/app/member/profile
 */
export async function GET(request: Request) {
  try {
    const auth = requireAppLogin(request)

    // TODO: 调用 MemberService.getProfile(auth.userId)
    return NextResponse.json({
      success: true,
      data: { userId: auth.userId, memberLevel: auth.memberLevel },
    })
  } catch (error: any) {
    const status = error.message === "请先登录" ? 401 : 400
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status })
  }
}

/**
 * 更新会员资料
 * PUT /api/v1/app/member/profile
 */
export async function PUT(request: Request) {
  try {
    const auth = requireAppLogin(request)
    const body = await request.json()

    // TODO: 调用 MemberService.updateProfile(auth.userId, body)
    return NextResponse.json({ success: true, data: { updated: true } })
  } catch (error: any) {
    const status = error.message === "请先登录" ? 401 : 400
    return NextResponse.json({ success: false, error: error?.message || "更新失败" }, { status })
  }
}

import { NextResponse } from "next/server"
import { memberPageQuerySchema, memberPointAdjustSchema } from "@/modules/member/backend/validators"
import { MemberService } from "@/modules/member/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.MEMBER_POINT_VIEW)
    const { searchParams } = new URL(request.url)
    const input = memberPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
    })
    const data = await MemberService.listPoints(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.MEMBER_POINT_ADJUST)
    const body = await request.json()
    const input = memberPointAdjustSchema.parse(body)
    const data = await MemberService.adjustPoint(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "积分调整失败" }, { status: 400 })
  }
}

import { NextResponse } from "next/server"
import { memberPageQuerySchema, memberUserUpdateSchema } from "@/modules/member/backend/validators"
import { MemberService } from "@/modules/member/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.MEMBER_USER_VIEW)
    const { searchParams } = new URL(request.url)
    const input = memberPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
      keyword: searchParams.get("keyword") ?? undefined,
      levelId: searchParams.get("levelId") ?? undefined,
    })
    const data = await MemberService.listUsers(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.MEMBER_USER_UPDATE)
    const body = await request.json()
    const input = memberUserUpdateSchema.parse(body)
    const data = await MemberService.updateUser(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "更新失败" }, { status: 400 })
  }
}

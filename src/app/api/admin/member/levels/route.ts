import { NextResponse } from "next/server"
import { memberPageQuerySchema, memberLevelCreateSchema } from "@/modules/member/backend/validators"
import { MemberService } from "@/modules/member/backend/services"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.MEMBER_LEVEL_VIEW)
    const { searchParams } = new URL(request.url)
    const input = memberPageQuerySchema.parse({
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 20,
    })
    const data = await MemberService.listLevels(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.MEMBER_LEVEL_CREATE)
    const body = await request.json()
    const input = memberLevelCreateSchema.parse(body)
    const data = await MemberService.createLevel(input)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message ?? "创建失败" }, { status: 400 })
  }
}

import { NextResponse } from "next/server"
import { PointsService } from "@/modules/member/backend/services/points.service"
import { MEMBER_ACTION_SCHEMAS } from "@/modules/member/contract/actions"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export async function GET(request: Request) {
  try {
    const data = await PointsService.page(parseActionQuery(MEMBER_ACTION_SCHEMAS["member.listPoints"], request))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await PointsService.create(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "创建失败" }, { status: 400 })
  }
}

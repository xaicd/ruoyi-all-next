import { NextResponse } from "next/server"
import { FansService } from "@/modules/mp/backend/services/fans.service"
import { MP_ACTION_SCHEMAS } from "@/modules/mp/contract/actions"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export async function GET(request: Request) {
  try {
    const data = await FansService.page(parseActionQuery(MP_ACTION_SCHEMAS["mp.listFans"], request))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await FansService.create(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "创建失败" }, { status: 400 })
  }
}

import { NextResponse } from "next/server"
import { ConversationsService } from "@/modules/im/backend/services/conversations.service"
import { IM_ACTION_SCHEMAS } from "@/modules/im/contract/actions"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export async function GET(request: Request) {
  try {
    const data = await ConversationsService.page(parseActionQuery(IM_ACTION_SCHEMAS["im.listConversations"], request))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await ConversationsService.create(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "创建失败" }, { status: 400 })
  }
}

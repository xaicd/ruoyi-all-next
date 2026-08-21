import { NextResponse } from "next/server"
import { ProcessDefinitionsService } from "@/modules/bpm/backend/services/process-definitions.service"
import { BPM_ACTION_SCHEMAS } from "@/modules/bpm/contract/actions"
import { parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"

export async function GET(request: Request) {
  try {
    const data = await ProcessDefinitionsService.page(parseActionQuery(BPM_ACTION_SCHEMAS["bpm.listDefinitions"], request))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "查询失败" }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await ProcessDefinitionsService.create(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "创建失败" }, { status: 400 })
  }
}

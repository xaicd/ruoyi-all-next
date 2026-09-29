import { NextResponse } from "next/server"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { AreaService } from "@/modules/system/backend/services/area.service"

export async function GET(request: Request) {
  return NextResponse.json({ success: true, data: await AreaService.page(parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.pageAreas"], request)) })
}

export async function POST(request: Request) {
  const data = await AreaService.createArea(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createArea"], await request.json()))
  return NextResponse.json({ success: true, data }, { status: 201 })
}

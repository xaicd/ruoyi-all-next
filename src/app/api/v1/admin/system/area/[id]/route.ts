import { NextResponse } from "next/server"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { AreaService } from "@/modules/system/backend/services/area.service"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await AreaService.getArea(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getArea"], { id })) })
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params
  const data = await AreaService.updateArea(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateArea"], { ...await request.json(), id }))
  return NextResponse.json({ success: true, data })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  return NextResponse.json({ success: true, data: await AreaService.deleteArea(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteArea"], { id })) })
}

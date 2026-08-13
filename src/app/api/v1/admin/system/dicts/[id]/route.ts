import { NextResponse } from "next/server"
import { SystemDictService } from "@/modules/system/backend/services/dict.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_DICT_VIEW)
    const { id } = await context.params
    const data = await SystemDictService.getType(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_DICT_CREATE)
    const { id } = await context.params
    const body = await request.json()
    const input = z.object({ name: z.string().trim().min(1).max(100).optional(), type: z.string().trim().max(100).optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional(), remark: z.string().trim().max(500).optional() }).parse(body)
    const data = await SystemDictService.updateType({ id, ...input })
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_DICT_CREATE)
    const { id } = await context.params
    const data = await SystemDictService.deleteType(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

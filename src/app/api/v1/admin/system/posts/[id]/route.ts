import { NextResponse } from "next/server"
import { SystemPostService } from "@/modules/system/backend/services/post.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }
const updateSchema = z.object({ name: z.string().trim().min(1).max(50).optional(), code: z.string().trim().min(1).max(64).optional(), sort: z.coerce.number().int().min(0).optional(), status: z.enum(["ACTIVE", "DISABLED"]).optional(), remark: z.string().trim().max(500).optional() })

export async function GET(request: Request, context: RouteContext) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_POST_VIEW)
    const { id } = await context.params
    const data = await SystemPostService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_POST_UPDATE)
    const { id } = await context.params
    const body = await request.json()
    const input = updateSchema.parse(body)
    const data = await SystemPostService.update({ id, ...input })
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: 400 }) }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_POST_DELETE)
    const { id } = await context.params
    const data = await SystemPostService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) { return NextResponse.json({ success: false, error: error?.message }, { status: error?.message?.includes("不存在") ? 404 : 400 }) }
}

import { NextResponse } from "next/server"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"
import { z } from "zod"

type RouteContext = { params: Promise<{ id: string }> }

const updateMenuSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  type: z.enum(["DIR", "MENU", "BUTTON"]).optional(),
  parentId: z.string().trim().nullable().optional(),
  permission: z.string().trim().max(100).optional(),
  path: z.string().trim().max(200).optional(),
  component: z.string().trim().max(200).optional(),
  icon: z.string().trim().max(100).optional(),
  sort: z.coerce.number().int().min(0).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  visible: z.boolean().optional(),
  keepAlive: z.boolean().optional(),
})

export async function GET(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_MENU_VIEW)
    const { id } = await context.params
    const data = await SystemMenuService.getById(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_MENU_UPDATE)
    const { id } = await context.params
    const body = await request.json()
    const input = updateMenuSchema.parse(body)
    const data = await SystemMenuService.update({ id, ...input })
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await ensurePermission(request, PERMISSIONS.SYSTEM_MENU_DELETE)
    const { id } = await context.params
    const data = await SystemMenuService.delete(id)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404
      : error?.message?.includes("子菜单") ? 409 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}

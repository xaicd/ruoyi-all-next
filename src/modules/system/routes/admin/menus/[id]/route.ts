import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemMenuService.getMenu(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getMenu"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_MENU_VIEW })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemMenuService.update(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateMenu"], { ...await request.json(), id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_MENU_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemMenuService.deleteMenu(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteMenu"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404
      : error?.message?.includes("子菜单") ? 409 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_MENU_DELETE })

import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemRoleService } from "@/modules/system/backend/services/role.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemRoleService.getRole(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.getRole"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_ROLE_VIEW })

export const PUT = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemRoleService.update(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateRole"], { ...await request.json(), id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_ROLE_UPDATE })

export const DELETE = withAdminRoute(async (_request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const data = await SystemRoleService.deleteRole(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.deleteRole"], { id }))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    const status = error?.message?.includes("不存在") ? 404
      : error?.message?.includes("不允许") ? 409 : 400
    return NextResponse.json({ success: false, error: error?.message }, { status })
  }
}, { permission: PERMISSIONS.SYSTEM_ROLE_DELETE })

export const PATCH = withAdminRoute(async (request, _auth, context: RouteContext) => {
  try {
    const { id } = await context.params
    const body = await request.json()
    if (body.action === "updateStatus") {
      const data = await SystemRoleService.updateRoleStatus(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.updateRoleStatus"], { id, status: body.status }))
      return NextResponse.json({ success: true, data })
    }
    if (body.action === "assignMenus" && Array.isArray(body.menuIds)) {
      const { SystemPermissionService } = await import("@/modules/system/backend/services/permission.service")
      const data = await SystemPermissionService.assignRoleMenu(parseActionBody(SYSTEM_ACTION_SCHEMAS["system.assignRoleMenu"], { roleId: id, menuIds: body.menuIds }))
      return NextResponse.json({ success: true, data })
    }
    return NextResponse.json({ success: false, error: "未知操作" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_ROLE_UPDATE })

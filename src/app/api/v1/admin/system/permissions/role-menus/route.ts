import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"

/** GET /api/v1/admin/system/permissions/role-menus?roleId=xxx */
export const GET = withAdminRoute(async (request, auth) => {
  try {
    const roleId = new URL(request.url).searchParams.get("roleId")?.trim()
    if (!roleId) return NextResponse.json({ success: false, error: "roleId 不能为空" }, { status: 400 })

    const menuIds = await SystemPermissionService.getRoleMenuIds(roleId)
    return NextResponse.json({ success: true, data: { menuIds } })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "获取角色菜单失败"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_ROLE_VIEW })

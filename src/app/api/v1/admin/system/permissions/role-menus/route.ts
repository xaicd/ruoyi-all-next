import { NextResponse } from "next/server"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { ensurePermission } from "@/modules/shared/backend/lib/permission-guard"

/** GET /api/v1/admin/system/permissions/role-menus?roleId=xxx */
export async function GET(request: Request) {
  try {
    ensurePermission(request, PERMISSIONS.SYSTEM_ROLE_VIEW)
    const roleId = new URL(request.url).searchParams.get("roleId")?.trim()
    if (!roleId) return NextResponse.json({ success: false, error: "roleId 不能为空" }, { status: 400 })

    const menuIds = await SystemPermissionService.getRoleMenuIds(roleId)
    return NextResponse.json({ success: true, data: { menuIds } })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "获取角色菜单失败"
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}

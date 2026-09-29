import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { parseActionBody, parseActionQuery } from "@/modules/shared/backend/http/parse-action-input"
import { SYSTEM_ACTION_SCHEMAS } from "@/modules/system/contract/actions"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getPlatformRole } from "@/modules/shared/backend/lib/biz-tenant"

export const GET = async (request: Request) => {
  try {
    const query = parseActionQuery(SYSTEM_ACTION_SCHEMAS["system.treeMenus"], request)
    if (query.mode === "tenant-package") {
      return withAdminRoute(async () => {
        try {
          const { getTenantPackageCandidateMenuIds } = await import("@/modules/system/backend/services/tenant-menu-scope.service")
          const data = await SystemMenuService.treeByIds(await getTenantPackageCandidateMenuIds())
          return NextResponse.json({ success: true, data })
        } catch (error: any) {
          return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
        }
      }, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW, platformOnly: true })(request)
    }

    if (query.mode === "role-assign") {
      return withAdminRoute(async () => {
        try {
          if (!query.roleId) return NextResponse.json({ success: false, error: "roleId 不能为空" }, { status: 400 })
          const { SystemPermissionService } = await import("@/modules/system/backend/services/permission.service")
          const data = await SystemMenuService.treeByIds(await SystemPermissionService.getRoleAssignableMenuIds(query.roleId))
          return NextResponse.json({ success: true, data })
        } catch (error: any) {
          return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
        }
      }, { permission: PERMISSIONS.SYSTEM_PERMISSION_ASSIGN_ROLE_MENU })(request)
    }

    return withAdminRoute(async (_request, auth) => {
      try {
        const excludePlatformControl = !auth.roles.includes(getPlatformRole())
        const data = query.mode === "list"
          ? await SystemMenuService.list({ status: query.status, excludePlatformControl })
          : await SystemMenuService.tree({ status: query.status, excludePlatformControl })
        return NextResponse.json({ success: true, data })
      } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
      }
    }, { permission: PERMISSIONS.SYSTEM_MENU_VIEW })(request)
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

export const POST = withAdminRoute(async (request) => {
  try {
    const input = parseActionBody(SYSTEM_ACTION_SCHEMAS["system.createMenu"], await request.json())
    const data = await SystemMenuService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_MENU_CREATE })

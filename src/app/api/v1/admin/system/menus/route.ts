import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"
import { isPlatformControlMenu } from "@/modules/system/backend/services/tenant-menu-scope.service"
import { PERMISSIONS } from "@/modules/shared/backend/constants/permissions"
import { getPlatformRole } from "@/modules/shared/backend/lib/biz-tenant"
import { z } from "zod"

const createMenuSchema = z.object({
  name: z.string().trim().min(1).max(50),
  type: z.enum(["DIR", "MENU", "BUTTON"]),
  parentId: z.string().trim().nullable().optional(),
  permission: z.string().trim().max(100).optional(),
  path: z.string().trim().max(200).optional(),
  component: z.string().trim().max(200).optional(),
  icon: z.string().trim().max(100).optional(),
  sort: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  visible: z.boolean().default(true),
  keepAlive: z.boolean().default(true),
})

type MenuTreeNode = {
  name: string
  permission: string | null
  path: string | null
  component: string | null
  children: MenuTreeNode[]
}

function excludePlatformControlMenuTree(nodes: MenuTreeNode[]): MenuTreeNode[] {
  return nodes
    .filter((node) => !isPlatformControlMenu(node))
    .map((node) => ({ ...node, children: excludePlatformControlMenuTree(node.children) }))
}

export const GET = async (request: Request) => {
  const mode = new URL(request.url).searchParams.get("mode")
  if (mode === "tenant-package") {
    return withAdminRoute(async (request, auth) => {
      try {
        const { getTenantPackageCandidateMenuIds } = await import("@/modules/system/backend/services/tenant-menu-scope.service")
        const data = await SystemMenuService.treeByIds(await getTenantPackageCandidateMenuIds())
        return NextResponse.json({ success: true, data })
      } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
      }
    }, { permission: PERMISSIONS.SYSTEM_TENANT_PACKAGE_VIEW, platformOnly: true })(request)
  }

  if (mode === "role-assign") {
    return withAdminRoute(async (request, auth) => {
      try {
        const roleId = new URL(request.url).searchParams.get("roleId")?.trim()
        if (!roleId) return NextResponse.json({ success: false, error: "roleId 不能为空" }, { status: 400 })
        const { SystemPermissionService } = await import("@/modules/system/backend/services/permission.service")
        const data = await SystemMenuService.treeByIds(await SystemPermissionService.getRoleAssignableMenuIds(roleId))
        return NextResponse.json({ success: true, data })
      } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
      }
    }, { permission: PERMISSIONS.SYSTEM_PERMISSION_ASSIGN_ROLE_MENU })(request)
  }

  return withAdminRoute(async (request, auth) => {
    try {
      const { searchParams } = new URL(request.url)
      const status = searchParams.get("status") || undefined
      const isPlatformAdmin = auth.roles.includes(getPlatformRole())
      if (mode === "list") {
        const data = await SystemMenuService.list({ status })
        return NextResponse.json({ success: true, data: isPlatformAdmin ? data : data.filter((menu) => !isPlatformControlMenu(menu)) })
      }
      const data = await SystemMenuService.tree({ status })
      return NextResponse.json({ success: true, data: isPlatformAdmin ? data : excludePlatformControlMenuTree(data) })
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
    }
  }, { permission: PERMISSIONS.SYSTEM_MENU_VIEW })(request)
}

export const POST = withAdminRoute(async (request, auth) => {
  try {
    const body = await request.json()
    const input = createMenuSchema.parse(body)
    const data = await SystemMenuService.create(input)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}, { permission: PERMISSIONS.SYSTEM_MENU_CREATE })

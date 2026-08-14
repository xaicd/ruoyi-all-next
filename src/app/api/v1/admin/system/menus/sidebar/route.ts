import { NextResponse } from "next/server"
import { withAdminRoute } from "@/modules/shared/backend/http/admin-route"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { isPlatformControlMenu } from "@/modules/system/backend/services/tenant-menu-scope.service"
import { getPlatformRole } from "@/modules/shared/backend/lib/biz-tenant"

type MenuNode = {
  id: string
  name: string
  permission: string | null
  type: string
  path: string | null
  component: string | null
  icon: string | null
  visible: boolean
  children: MenuNode[]
}

type SidebarItem = { id: string; href: string | null; label: string; icon: string; children: SidebarItem[] }
type SidebarGroup = { id: string; title: string; icon: string; children: SidebarItem[] }

const componentRoutes: Record<string, string> = {
  "system/user/index": "/admin/system/users", "system/role/index": "/admin/system/roles", "system/menu/index": "/admin/system/menus",
  "system/dept/index": "/admin/system/depts", "system/post/index": "/admin/system/posts", "system/dict/index": "/admin/system/dicts",
  "system/tenant/index": "/admin/system/tenants", "system/tenantPackage/index": "/admin/system/tenant-packages", "system/notice/index": "/admin/system/notices",
  "system/loginlog/index": "/admin/system/login-logs", "system/operatelog/index": "/admin/system/operate-logs", "system/oauth2/client/index": "/admin/system/oauth2-clients",
  "system/oauth2/token/index": "/admin/system/oauth2-tokens", "system/sms/channel/index": "/admin/system/sms-channels", "system/sms/log/index": "/admin/system/sms-logs",
  "system/mail/account/index": "/admin/system/mail-accounts", "system/mail/log/index": "/admin/system/mail-logs", "infra/config/index": "/admin/infra/configs",
  "infra/job/index": "/admin/infra/job-center", "infra/file/index": "/admin/infra/files", "infra/dataSourceConfig/index": "/admin/infra/db-configs", "infra/codegen/index": "/admin/infra/codegen",
  "infra/build/index": "/admin/infra/page-builder", "infra/apiAccessLog/index": "/admin/infra/api-access-log", "infra/apiErrorLog/index": "/admin/infra/api-error-logs",
  "pay/order/index": "/admin/pay/orders", "pay/refund/index": "/admin/pay/refunds", "crm/customer/index": "/admin/crm/customers", "crm/clue/index": "/admin/crm/clues",
}

function iconFor(icon: string | null, type: string): string {
  const icons: Record<string, string> = { "ep:tools": "⚙️", "ep:monitor": "🔧", "ep:avatar": "👤", "ep:user": "🛡️", "ep:menu": "📋", "fa:address-card": "🏢", "fa:address-book-o": "💼", "ep:collection": "📖", "ep:takeaway-box": "📢", "fa:road": "🏠", "fa:key": "🔑", "fa:tasks": "⏰", "ep:upload-filled": "📁", "ep:document-copy": "🛠️", "fa:fighter-jet": "🌐", "ep:message": "📱", "fa:stack-exchange": "📨", "ep:connection": "✉️", "ep:coffee-cup": "☕", "fa:reddit-square": "🔴", "ep:aim": "🎯", "ep:setting": "⚙️" }
  return (icon && icons[icon]) || (type === "DIR" ? "📁" : "📄")
}

function hrefFor(node: MenuNode): string | null {
  if (node.type !== "MENU") return null
  return (node.component && componentRoutes[node.component]) || (node.path?.startsWith("/") ? node.path : null)
}

function toSidebarItem(node: MenuNode, allowedMenuIds: Set<string>, isPlatformAdmin: boolean): SidebarItem | null {
  if (!isPlatformAdmin && isPlatformControlMenu(node)) return null
  if (!node.visible || node.type === "BUTTON") return null
  const children = node.children.map((child) => toSidebarItem(child, allowedMenuIds, isPlatformAdmin)).filter((item): item is SidebarItem => item !== null)
  // 目录本身没有授权记录时，只要存在被授权的后代就保留，保证导航层级完整。
  if (!allowedMenuIds.has(node.id) && children.length === 0) return null
  return { id: node.id, href: hrefFor(node), label: node.name, icon: iconFor(node.icon, node.type), children }
}

/** Returns the same active system_menu tree used by menu management, excluding only buttons and hidden entries. */
export const GET = withAdminRoute(async (request, auth) => {
  try {
    const [tree, effectiveMenuIds] = await Promise.all([
      SystemMenuService.tree({ status: "ACTIVE" }) as Promise<MenuNode[]>,
      SystemPermissionService.getEffectiveUserMenuIds(auth.userId),
    ])
    const allowedMenuIds = new Set(effectiveMenuIds)
    const isPlatformAdmin = auth.roles.includes(getPlatformRole())
    const data: SidebarGroup[] = tree
      .filter((node) => node.type === "DIR" && node.visible)
      .map((node) => {
        const item = toSidebarItem(node, allowedMenuIds, isPlatformAdmin)
        return item ? { id: node.id, title: node.name, icon: iconFor(node.icon, node.type), children: item.children } : null
      })
      .filter((group): group is SidebarGroup => group !== null && group.children.length > 0)
    return NextResponse.json({ success: true, data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "菜单导航加载失败"
    const status = message.includes("用户不存在") ? 401 : 400
    return NextResponse.json({ success: false, error: message }, { status })
  }
})

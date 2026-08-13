import { NextResponse } from "next/server"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"

/**
 * GET /api/v1/admin/system/menus/sidebar
 * 
 * 将数据库菜单树转换为 sidebar 格式，供 layout.tsx 动态加载
 * 只返回 DIR/MENU 类型（不含 BUTTON），并映射到前端路由
 */
export async function GET() {
  try {
    const tree = await SystemMenuService.tree({ status: "ACTIVE" })
    const sidebarGroups = convertToSidebar(tree)
    return NextResponse.json({ success: true, data: sidebarGroups })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 400 })
  }
}

type MenuNode = {
  id: string
  name: string
  type: string
  path: string | null
  component: string | null
  icon: string | null
  parentId: string | null
  sort: number
  children: MenuNode[]
}

type SidebarItem = { href: string; label: string; icon: string }
type SidebarGroup = { title: string; icon: string; children: SidebarItem[] }

function componentToHref(component: string | null, path: string | null): string | null {
  if (!component) return path ? (path.startsWith("/") ? path : "/admin/" + path) : null
  
  // Map component paths like "system/user/index" to "/admin/system/users"
  // This is the standard ruoyi-vue-pro component → route mapping
  const componentMap: Record<string, string> = {
    // System
    "system/user/index": "/admin/system/users",
    "system/role/index": "/admin/system/roles",
    "system/menu/index": "/admin/system/menus",
    "system/dept/index": "/admin/system/depts",
    "system/post/index": "/admin/system/posts",
    "system/dict/index": "/admin/system/dicts",
    "system/tenant/index": "/admin/system/tenants",
    "system/tenantPackage/index": "/admin/system/tenant-packages",
    "system/notice/index": "/admin/system/notices",
    "system/loginlog/index": "/admin/system/login-logs",
    "system/operatelog/index": "/admin/system/operate-logs",
    "system/oauth2/client/index": "/admin/system/oauth2-clients",
    "system/oauth2/token/index": "/admin/system/oauth2-tokens",
    "system/sms/channel/index": "/admin/system/sms-channels",
    "system/sms/log/index": "/admin/system/sms-logs",
    "system/mail/account/index": "/admin/system/mail-accounts",
    "system/mail/log/index": "/admin/system/mail-logs",
    // Infra
    "infra/config/index": "/admin/infra/configs",
    "infra/job/index": "/admin/infra/job-center",
    "infra/file/index": "/admin/infra/files",
    "infra/codegen/index": "/admin/infra/codegen",
    "infra/build/index": "/admin/infra/page-builder",
    "infra/apiAccessLog/index": "/admin/infra/api-logs",
    "infra/apiErrorLog/index": "/admin/infra/api-error-logs",
    // Pay
    "pay/order/index": "/admin/pay/orders",
    "pay/refund/index": "/admin/pay/refunds",
    // CRM
    "crm/customer/index": "/admin/crm/customers",
    "crm/clue/index": "/admin/crm/clues",
    // Demo/codegen
    "infra/testDemo/index": "/admin/infra/demo01contact",
  }
  
  if (componentMap[component]) return componentMap[component]
  
  // Generic fallback: convert component path to href
  // "system/user/index" → "/admin/system/user"
  const parts = component.replace("/index", "").split("/")
  return "/admin/" + parts.join("/")
}

function getIconEmoji(icon: string | null, type: string): string {
  if (!icon) return type === "DIR" ? "📁" : "📄"
  
  // Map common ep: and fa: icons to emojis
  const iconMap: Record<string, string> = {
    "ep:tools": "⚙️", "ep:monitor": "🔧", "ep:avatar": "👤", "ep:user": "🛡️",
    "ep:menu": "📋", "fa:address-card": "🏢", "fa:address-book-o": "💼",
    "ep:collection": "📖", "ep:takeaway-box": "📢", "fa:road": "🏠",
    "fa:key": "🔑", "fa:tasks": "⏰", "ep:upload-filled": "📁",
    "ep:document-copy": "🛠️", "fa:fighter-jet": "🌐", "ep:message": "📱",
    "fa:stack-exchange": "📨", "ep:connection": "✉️", "ep:coffee-cup": "☕",
    "fa:reddit-square": "🔴", "ep:aim": "🎯", "ep:setting": "⚙️",
  }
  
  return iconMap[icon] || (type === "DIR" ? "📁" : "📄")
}

function convertToSidebar(tree: MenuNode[]): SidebarGroup[] {
  const groups: SidebarGroup[] = []
  
  for (const dir of tree) {
    if (dir.type !== "DIR") continue
    
    const children: SidebarItem[] = []
    
    for (const menu of dir.children || []) {
      if (menu.type !== "MENU") continue
      const href = componentToHref(menu.component, menu.path)
      if (!href) continue
      
      children.push({
        href,
        label: menu.name,
        icon: getIconEmoji(menu.icon, "MENU"),
      })
    }
    
    if (children.length > 0) {
      groups.push({
        title: dir.name,
        icon: getIconEmoji(dir.icon, "DIR"),
        children,
      })
    }
  }
  
  return groups
}

import { SystemMenuRepository } from "@/modules/system/backend/repositories/menu.repository"
import { SystemMenuService } from "@/modules/system/backend/services/menu.service"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"

async function main() {
  const all = await SystemMenuRepository.findAll()
  console.log("Total menus:", all.length)
  const aiMenus = all.filter(m => m.id.startsWith("ai-") || m.name.includes("模型") || m.name.includes("渠道"))
  console.log("AI Menus in repo:", aiMenus.map(m => ({ id: m.id, name: m.name, parentId: m.parentId, type: m.type, component: m.component, path: m.path })))

  const tree = await SystemMenuService.tree({ status: "ACTIVE" })
  console.log("Tree roots:", tree.map(t => ({ id: t.id, name: t.name, childrenCount: t.children.length })))

  const effectiveIds = await SystemPermissionService.getEffectiveUserMenuIds("1")
  console.log("Effective ids count:", effectiveIds.length)
  console.log("Has ai-gateway-dir:", effectiveIds.includes("ai-gateway-dir"))
  console.log("Has ai-gateway-channels:", effectiveIds.includes("ai-gateway-channels"))

  const nav = await SystemMenuService.getSidebarNav({ userId: "1", isPlatformAdmin: true })
  console.log("Sidebar nav titles:", nav.map(n => n.title))
}

main().catch(console.error)

/**
 * System Menu Service - 树形菜单管理
 */

import { SystemMenuRepository, type SystemMenuRow } from "@/modules/system/backend/repositories/menu.repository"
import { isPlatformControlMenu } from "@/modules/system/backend/services/tenant-menu-scope.service"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type MenuTreeNode = SystemMenuRow & { children: MenuTreeNode[] }

function buildTree(list: SystemMenuRow[]): MenuTreeNode[] {
  const map = new Map<string, MenuTreeNode>()
  const roots: MenuTreeNode[] = []
  for (const item of list) map.set(item.id, { ...item, children: [] })
  for (const item of list) {
    const node = map.get(item.id)!
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

async function validateParent(menuId: string | undefined, parentId: string | null | undefined, childType: string): Promise<void> {
  if (parentId === undefined || parentId === null || parentId === "") return
  if (parentId === menuId) throw new Error("不能将自己设为父菜单")

  const parent = await SystemMenuRepository.findById(parentId)
  if (!parent) throw new Error(`父菜单不存在: ${parentId}`)
  if (parent.status !== "ACTIVE") throw new Error(`父菜单已停用: ${parentId}`)
  if (parent.type === "BUTTON") throw new Error("按钮类型不能作为父菜单")
  if (childType !== "DIR" && childType !== "MENU" && childType !== "BUTTON") throw new Error("菜单类型不合法")

  const seen = new Set<string>()
  let current: SystemMenuRow | null = parent
  while (current) {
    if (current.id === menuId) throw new Error("不能将菜单移动到自己的子菜单下")
    if (seen.has(current.id)) throw new Error("菜单层级存在循环")
    seen.add(current.id)
    current = current.parentId ? await SystemMenuRepository.findById(current.parentId) : null
    if (current === null) break
  }
}

function excludePlatformControlMenuTree(nodes: MenuTreeNode[]): MenuTreeNode[] {
  return nodes
    .filter((node) => !isPlatformControlMenu(node))
    .map((node) => ({ ...node, children: excludePlatformControlMenuTree(node.children) }))
}

export class SystemMenuService {
  static async tree(params?: { status?: string; excludePlatformControl?: boolean }) {
    const list = await SystemMenuRepository.findAll({ status: params?.status })
    const tree = params?.excludePlatformControl ? excludePlatformControlMenuTree(buildTree(list)) : buildTree(list)
    domainLog.event("system.menu.tree", { total: list.length })
    return tree
  }

  static async treeByIds(menuIds: Iterable<string>) {
    const allowedIds = new Set(menuIds)
    const list = (await SystemMenuRepository.findAll({ status: "ACTIVE" })).filter((menu) => allowedIds.has(menu.id))
    const tree = buildTree(list)
    domainLog.event("system.menu.scopedTree", { total: list.length })
    return tree
  }

  static async list(params?: { status?: string; excludePlatformControl?: boolean }) {
    const list = await SystemMenuRepository.findAll({ status: params?.status })
    const data = params?.excludePlatformControl ? list.filter((menu) => !isPlatformControlMenu(menu)) : list
    domainLog.event("system.menu.list", { total: data.length })
    return data
  }

  static async getById(id: string) {
    const menu = await SystemMenuRepository.findById(id)
    if (!menu) throw new Error(`菜单不存在: ${id}`)
    return menu
  }

  static async create(input: any) {
    await validateParent(undefined, input.parentId, input.type)
    const menu = await SystemMenuRepository.create(input)
    domainLog.event("system.menu.create", { menuId: menu.id })
    domainLog.audit("system.menu.create", { targetType: "MENU", targetId: menu.id })
    return { id: menu.id }
  }

  static async update(input: { id: string; name?: string; type?: string; parentId?: string | null; permission?: string; path?: string; component?: string; icon?: string; sort?: number; status?: string; visible?: boolean; keepAlive?: boolean }) {
    const existing = await SystemMenuRepository.findById(input.id)
    if (!existing) throw new Error(`菜单不存在: ${input.id}`)
    await validateParent(input.id, input.parentId, input.type ?? existing.type)

    const { id, ...data } = input
    await SystemMenuRepository.update(id, data)
    domainLog.event("system.menu.update", { menuId: id })
    domainLog.audit("system.menu.update", { targetType: "MENU", targetId: id })
    return { id }
  }

  static async delete(id: string) {
    const existing = await SystemMenuRepository.findById(id)
    if (!existing) throw new Error(`菜单不存在: ${id}`)
    await SystemMenuRepository.delete(id)
    domainLog.event("system.menu.delete", { menuId: id })
    domainLog.audit("system.menu.delete", { targetType: "MENU", targetId: id })
    return { success: true }
  }

  static async getMenu(input: { id: string }) { return this.getById(input.id) }
  static async deleteMenu(input: { id: string }) { return this.delete(input.id) }

  static async getSidebarNav(input: { userId: string; isPlatformAdmin?: boolean }) {
    const { SystemPermissionService } = await import("@/modules/system/backend/services/permission.service")
    type MenuNode = { id: string; name: string; permission: string | null; type: string; path: string | null; component: string | null; icon: string | null; visible: boolean; children: MenuNode[] }
    type SidebarItem = { id: string; href: string | null; label: string; icon: string; children: SidebarItem[] }
    const componentRoutes: Record<string, string> = {
      "system/user/index": "/admin/system/users", "system/role/index": "/admin/system/roles", "system/menu/index": "/admin/system/menus",
      "system/dept/index": "/admin/system/depts", "system/post/index": "/admin/system/posts", "system/dict/index": "/admin/system/dicts",
      "system/tenant/index": "/admin/system/tenants", "system/tenantPackage/index": "/admin/system/tenant-packages", "system/notice/index": "/admin/system/notices",
      "system/loginlog/index": "/admin/system/login-logs", "system/operatelog/index": "/admin/system/operate-logs", "system/oauth2/client/index": "/admin/system/oauth2-clients",
      "system/oauth2/token/index": "/admin/system/oauth2-tokens", "system/sms/channel/index": "/admin/system/sms-channels", "system/sms/log/index": "/admin/system/sms-logs",
      "system/mail/account/index": "/admin/system/mail-accounts", "system/mail/log/index": "/admin/system/mail-logs", "infra/config/index": "/admin/infra/configs",
      "infra/job/index": "/admin/infra/job-center", "infra/file/index": "/admin/infra/files", "infra/dataSourceConfig/index": "/admin/infra/db-configs", "infra/codegen/index": "/admin/infra/codegen",
      "infra/build/index": "/admin/infra/page-builder", "infra/online-definition/index": "/admin/infra/online-definitions", "infra/online-test/index": "/admin/infra/online-test", "infra/apiAccessLog/index": "/admin/infra/api-access-log", "infra/apiErrorLog/index": "/admin/infra/api-error-logs",
      "pay/order/index": "/admin/pay/orders", "pay/refund/index": "/admin/pay/refunds", "crm/customer/index": "/admin/crm/customers", "crm/clue/index": "/admin/crm/clues",
      "aigw/channel/index": "/admin/aigw/channels", "aigw/model/index": "/admin/aigw/models", "aigw/token/index": "/admin/aigw/tokens",
      "aigw/usage/index": "/admin/aigw/usages", "aigw/playground/index": "/admin/aigw/playground", "aigw/chat/index": "/admin/aigw/chats",
      "ai/chat-conversation/index": "/admin/ai/ai-chat-conversation", "ai/chat-role/index": "/admin/ai/ai-chat-role",
      "ai/knowledge/index": "/admin/ai/ai-knowledge", "ai/image/index": "/admin/ai/ai-image",
      "ai/mind-map/index": "/admin/ai/ai-mind-map", "ai/write/index": "/admin/ai/ai-write",
      "ai/workflow/index": "/admin/ai/ai-workflow",
    }



    const iconFor = (icon: string | null, type: string) => icon || (type === "DIR" ? "folder" : "file")

    const hrefFor = (node: MenuNode) => node.type !== "MENU" ? null : (node.component && componentRoutes[node.component]) || (node.path?.startsWith("/") ? node.path : null)
    const toSidebarItem = (node: MenuNode, allowedMenuIds: Set<string>, isPlatformAdmin: boolean): SidebarItem | null => {
      if (!isPlatformAdmin && isPlatformControlMenu(node)) return null
      if (!node.visible || node.type === "BUTTON") return null
      const children = node.children.map((child) => toSidebarItem(child, allowedMenuIds, isPlatformAdmin)).filter((item): item is SidebarItem => item !== null)
      if (!allowedMenuIds.has(node.id) && children.length === 0) return null
      return { id: node.id, href: hrefFor(node), label: node.name, icon: iconFor(node.icon, node.type), children }
    }
    const [tree, effectiveMenuIds] = await Promise.all([
      this.tree({ status: "ACTIVE" }) as Promise<MenuNode[]>,
      SystemPermissionService.getEffectiveUserMenuIds(input.userId),
    ])
    const allowedMenuIds = new Set(effectiveMenuIds)
    const isPlatformAdmin = Boolean(input.isPlatformAdmin)
    const data = tree
      .filter((node) => node.type === "DIR" && node.visible)
      .map((node) => {
        const item = toSidebarItem(node, allowedMenuIds, isPlatformAdmin)
        return item ? { id: node.id, title: node.name, icon: iconFor(node.icon, node.type), children: item.children } : null
      })
      .filter((group): group is { id: string; title: string; icon: string; children: SidebarItem[] } => group !== null && group.children.length > 0)
    domainLog.event("system.menu.sidebar", { userId: input.userId, groups: data.length })
    return data
  }
}

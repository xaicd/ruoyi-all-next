/**
 * System Menu Service - 树形菜单管理
 */

import { SystemMenuRepository, type SystemMenuRow } from "@/modules/system/backend/repositories/menu.repository"
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

export class SystemMenuService {
  static async tree(params?: { status?: string }) {
    const list = await SystemMenuRepository.findAll(params)
    const tree = buildTree(list)
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

  static async list(params?: { status?: string }) {
    const list = await SystemMenuRepository.findAll(params)
    domainLog.event("system.menu.list", { total: list.length })
    return list
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
}

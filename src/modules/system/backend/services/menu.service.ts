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
    const menu = await SystemMenuRepository.create(input)
    domainLog.event("system.menu.create", { menuId: menu.id })
    domainLog.audit("system.menu.create", { targetType: "MENU", targetId: menu.id })
    return { id: menu.id }
  }

  static async update(input: { id: string; name?: string; type?: string; parentId?: string; permission?: string; path?: string; component?: string; icon?: string; sort?: number; status?: string; visible?: boolean; keepAlive?: boolean }) {
    const existing = await SystemMenuRepository.findById(input.id)
    if (!existing) throw new Error(`菜单不存在: ${input.id}`)
    if (input.parentId === input.id) throw new Error("不能将自己设为父菜单")

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

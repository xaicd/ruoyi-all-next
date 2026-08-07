/**
 * System Dept Service - 树形部门管理
 */

import { SystemDeptRepository, type SystemDeptRow } from "@/modules/system/backend/repositories/dept.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type DeptTreeNode = SystemDeptRow & { children: DeptTreeNode[] }

type ListInput = { status?: string; keyword?: string }
type CreateInput = { name: string; parentId?: string; sort?: number; leaderId?: string; phone?: string; email?: string; status?: string }
type UpdateInput = { id: string; name?: string; parentId?: string; sort?: number; leaderId?: string; phone?: string; email?: string; status?: string }

function buildTree(list: SystemDeptRow[]): DeptTreeNode[] {
  const map = new Map<string, DeptTreeNode>()
  const roots: DeptTreeNode[] = []

  for (const item of list) {
    map.set(item.id, { ...item, children: [] })
  }

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

export class SystemDeptService {
  /** 获取部门树 */
  static async tree(input?: ListInput) {
    const list = await SystemDeptRepository.findAll(input)
    const tree = buildTree(list)
    domainLog.event("system.dept.tree", { total: list.length })
    return tree
  }

  /** 获取平铺列表 */
  static async list(input?: ListInput) {
    const list = await SystemDeptRepository.findAll(input)
    domainLog.event("system.dept.list", { total: list.length })
    return list
  }

  static async getById(id: string) {
    const dept = await SystemDeptRepository.findById(id)
    if (!dept) throw new Error(`部门不存在: ${id}`)
    domainLog.event("system.dept.get", { deptId: id })
    return dept
  }

  static async create(input: CreateInput) {
    // 验证父部门存在
    if (input.parentId) {
      const parent = await SystemDeptRepository.findById(input.parentId)
      if (!parent) throw new Error(`父部门不存在: ${input.parentId}`)
    }

    const dept = await SystemDeptRepository.create(input)
    domainLog.event("system.dept.create", { deptId: dept.id })
    domainLog.audit("system.dept.create", { targetType: "DEPT", targetId: dept.id })
    return { id: dept.id }
  }

  static async update(input: UpdateInput) {
    const existing = await SystemDeptRepository.findById(input.id)
    if (!existing) throw new Error(`部门不存在: ${input.id}`)

    // 不能将自己设为父部门
    if (input.parentId === input.id) throw new Error("不能将自己设为父部门")

    const { id, ...data } = input
    await SystemDeptRepository.update(id, data)
    domainLog.event("system.dept.update", { deptId: id })
    domainLog.audit("system.dept.update", { targetType: "DEPT", targetId: id })
    return { id }
  }

  static async delete(id: string) {
    const existing = await SystemDeptRepository.findById(id)
    if (!existing) throw new Error(`部门不存在: ${id}`)

    await SystemDeptRepository.delete(id)
    domainLog.event("system.dept.delete", { deptId: id })
    domainLog.audit("system.dept.delete", { targetType: "DEPT", targetId: id })
    return { success: true }
  }
}

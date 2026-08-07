/**
 * System Role Service
 */

import { SystemRoleRepository } from "@/modules/system/backend/repositories/role.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type RoleListInput = { page: number; pageSize: number; keyword?: string; status?: string }
type CreateRoleInput = { name: string; code: string; sort?: number; status?: string; dataScope?: string; remark?: string }
type UpdateRoleInput = { id: string; name?: string; code?: string; sort?: number; status?: string; dataScope?: string; remark?: string }

export class SystemRoleService {
  static async list(input: RoleListInput) {
    const result = await SystemRoleRepository.findList(input)
    domainLog.event("system.role.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const role = await SystemRoleRepository.findById(id)
    if (!role) throw new Error(`角色不存在: ${id}`)
    domainLog.event("system.role.get", { roleId: id })
    return role
  }

  static async create(input: CreateRoleInput) {
    const existing = await SystemRoleRepository.findByCode(input.code)
    if (existing) throw new Error(`角色编码已存在: ${input.code}`)

    const role = await SystemRoleRepository.create(input)
    domainLog.event("system.role.create", { roleId: role.id, code: role.code })
    domainLog.audit("system.role.create", { targetType: "ROLE", targetId: role.id })
    return { id: role.id }
  }

  static async update(input: UpdateRoleInput) {
    const existing = await SystemRoleRepository.findById(input.id)
    if (!existing) throw new Error(`角色不存在: ${input.id}`)

    if (input.code && input.code !== existing.code) {
      const conflict = await SystemRoleRepository.findByCode(input.code)
      if (conflict) throw new Error(`角色编码已存在: ${input.code}`)
    }

    const { id, ...data } = input
    await SystemRoleRepository.update(id, data)
    domainLog.event("system.role.update", { roleId: id })
    domainLog.audit("system.role.update", { targetType: "ROLE", targetId: id })
    return { id }
  }

  static async delete(id: string) {
    const existing = await SystemRoleRepository.findById(id)
    if (!existing) throw new Error(`角色不存在: ${id}`)
    if (existing.code === "super_admin") throw new Error("不允许删除超级管理员角色")

    await SystemRoleRepository.delete(id)
    domainLog.event("system.role.delete", { roleId: id })
    domainLog.audit("system.role.delete", { targetType: "ROLE", targetId: id })
    return { success: true }
  }

  static async updateStatus(id: string, status: "ACTIVE" | "DISABLED") {
    const existing = await SystemRoleRepository.findById(id)
    if (!existing) throw new Error(`角色不存在: ${id}`)

    await SystemRoleRepository.update(id, { status })
    domainLog.event("system.role.updateStatus", { roleId: id, status })
    domainLog.audit("system.role.updateStatus", { targetType: "ROLE", targetId: id, newStatus: status })
    return { success: true }
  }
}

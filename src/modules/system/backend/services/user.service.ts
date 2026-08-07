/**
 * System User Service
 *
 * 职责：业务编排、校验、日志审计
 * 数据访问：委托给 UserRepository（支持多数据库）
 */

import type {
  UserListQueryInput,
  CreateUserInput,
  UpdateUserInput,
  UpdateUserPasswordInput,
} from "@/modules/system/backend/validators"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class SystemUserService {
  /** 分页列表 */
  static async list(input: UserListQueryInput) {
    const result = await SystemUserRepository.findList({
      page: input.page,
      pageSize: input.pageSize,
      keyword: input.keyword,
      status: input.status,
      deptId: input.deptId,
    })

    domainLog.event("system.user.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
      total: result.total,
    })

    // 不返回 password
    const items = result.items.map(({ password, ...rest }) => rest)
    return { ...result, items }
  }

  /** 获取单个用户详情 */
  static async getById(id: string) {
    const user = await SystemUserRepository.findById(id)
    if (!user) {
      throw new Error(`用户不存在: ${id}`)
    }

    domainLog.event("system.user.get", { userId: id })

    const { password, ...rest } = user
    return rest
  }

  /** 创建用户 */
  static async create(input: CreateUserInput) {
    // 用户名唯一性检查
    const existing = await SystemUserRepository.findByUsername(input.username)
    if (existing) {
      throw new Error(`用户名已存在: ${input.username}`)
    }

    // 密码加密（生产环境应使用 bcrypt）
    const hashedPassword = `$2b$10$${Buffer.from(input.password).toString("base64")}`

    const user = await SystemUserRepository.create({
      username: input.username,
      nickname: input.nickname,
      password: hashedPassword,
      phone: input.phone,
      email: input.email || undefined,
      deptId: input.deptId,
      status: input.status,
      remark: input.remark,
    })

    domainLog.event("system.user.create", { userId: user.id, username: user.username })
    domainLog.audit("system.user.create", {
      targetType: "USER",
      targetId: user.id,
      username: user.username,
    })

    return { id: user.id }
  }

  /** 更新用户 */
  static async update(input: UpdateUserInput) {
    const existing = await SystemUserRepository.findById(input.id)
    if (!existing) {
      throw new Error(`用户不存在: ${input.id}`)
    }

    // 用户名唯一性检查
    if (input.username && input.username !== existing.username) {
      const conflict = await SystemUserRepository.findByUsername(input.username)
      if (conflict) {
        throw new Error(`用户名已存在: ${input.username}`)
      }
    }

    await SystemUserRepository.update(input.id, {
      username: input.username,
      nickname: input.nickname,
      phone: input.phone,
      email: input.email || undefined,
      deptId: input.deptId,
      status: input.status,
      remark: input.remark,
    })

    domainLog.event("system.user.update", { userId: input.id })
    domainLog.audit("system.user.update", {
      targetType: "USER",
      targetId: input.id,
    })

    return { id: input.id }
  }

  /** 重置密码 */
  static async resetPassword(input: UpdateUserPasswordInput) {
    const existing = await SystemUserRepository.findById(input.id)
    if (!existing) {
      throw new Error(`用户不存在: ${input.id}`)
    }

    const hashedPassword = `$2b$10$${Buffer.from(input.password).toString("base64")}`
    await SystemUserRepository.update(input.id, { password: hashedPassword })

    domainLog.event("system.user.resetPassword", { userId: input.id })
    domainLog.audit("system.user.resetPassword", {
      targetType: "USER",
      targetId: input.id,
    })

    return { success: true }
  }

  /** 删除用户 */
  static async delete(id: string) {
    const existing = await SystemUserRepository.findById(id)
    if (!existing) {
      throw new Error(`用户不存在: ${id}`)
    }

    if (existing.username === "admin") {
      throw new Error("不允许删除超级管理员")
    }

    await SystemUserRepository.delete(id)

    domainLog.event("system.user.delete", { userId: id })
    domainLog.audit("system.user.delete", {
      targetType: "USER",
      targetId: id,
    })

    return { success: true }
  }

  /** 修改状态 */
  static async updateStatus(id: string, status: "ACTIVE" | "DISABLED") {
    const existing = await SystemUserRepository.findById(id)
    if (!existing) {
      throw new Error(`用户不存在: ${id}`)
    }

    await SystemUserRepository.update(id, { status })

    domainLog.event("system.user.updateStatus", { userId: id, status })
    domainLog.audit("system.user.updateStatus", {
      targetType: "USER",
      targetId: id,
      newStatus: status,
    })

    return { success: true }
  }
}

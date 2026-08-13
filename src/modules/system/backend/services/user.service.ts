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
import { SystemDeptRepository } from "@/modules/system/backend/repositories/dept.repository"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { getCurrentTenantId, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"
import { hashPassword, generateSalt } from "@/modules/shared/backend/lib/crypto"

async function requireCurrentTenantDept(deptId: string | undefined): Promise<void> {
  if (!deptId) return
  const dept = await SystemDeptRepository.findById(deptId)
  if (!dept) throw new Error(`部门不存在或不属于当前租户: ${deptId}`)
}

/** Enforce the tenant's purchased account capacity before adding a tenant user. */
async function requireTenantAccountCapacity(): Promise<void> {
  const tenantId = getCurrentTenantId()
  if (!tenantId || isPlatformContext()) return
  const tenant = await SystemTenantRepository.findById(tenantId)
  if (!tenant || tenant.status !== "ACTIVE") throw new Error("当前租户不存在或已停用")
  const currentCount = await SystemUserRepository.count({ tenantId })
  if (currentCount >= tenant.accountCount) throw new Error("租户账号额度已用尽")
}

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
    const roleIds = await SystemPermissionService.getUserRoleIds(id)
    return { ...rest, roleIds }
  }

  /** 创建用户 */
  static async create(input: CreateUserInput) {
    // 用户名唯一性检查
    const existing = await SystemUserRepository.findByUsername(input.username)
    if (existing) {
      throw new Error(`用户名已存在: ${input.username}`)
    }
    await requireCurrentTenantDept(input.deptId)
    await requireTenantAccountCapacity()

    // 密码加密：双重 MD5 + Salt
    const salt = generateSalt()
    const hashedPassword = hashPassword(input.password, salt)

    const user = await SystemUserRepository.create({
      username: input.username,
      nickname: input.nickname,
      password: hashedPassword,
      salt,
      phone: input.phone,
      email: input.email || undefined,
      deptId: input.deptId,
      status: input.status,
      remark: input.remark,
    })

    if (input.roleIds !== undefined) {
      await SystemPermissionService.assignUserRole({ userId: user.id, roleIds: input.roleIds })
    }

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

    await requireCurrentTenantDept(input.deptId)

    await SystemUserRepository.update(input.id, {
      username: input.username,
      nickname: input.nickname,
      phone: input.phone,
      email: input.email || undefined,
      deptId: input.deptId,
      status: input.status,
      remark: input.remark,
    })

    if (input.roleIds !== undefined) {
      await SystemPermissionService.assignUserRole({ userId: input.id, roleIds: input.roleIds })
    }

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

    const newSalt = generateSalt()
    const hashedPassword = hashPassword(input.password, newSalt)
    await SystemUserRepository.update(input.id, { password: hashedPassword, salt: newSalt })

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

// Alias for codegen-generated routes
export { SystemUserService as UserService }

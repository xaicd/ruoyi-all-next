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
import { SystemPostRepository } from "@/modules/system/backend/repositories/post.repository"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { SystemPermissionService } from "@/modules/system/backend/services/permission.service"
import { TenantEntitlementService } from "@/modules/system/backend/services/tenant-entitlement.service"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { getCurrentTenantId, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"
import { hashPassword, generateSalt } from "@/modules/shared/backend/lib/crypto"

async function requireCurrentTenantDept(deptId: string | undefined, expectedTenantId: string | null): Promise<void> {
  if (!deptId) return
  const dept = await SystemDeptRepository.findById(deptId)
  if (!dept || dept.tenantId !== expectedTenantId) throw new Error(`部门不存在或不属于目标租户: ${deptId}`)
  if (dept.status !== "ACTIVE") throw new Error(`部门已停用: ${deptId}`)
}

async function requireCurrentTenantPosts(postIds: string[] | undefined, expectedTenantId: string | null): Promise<void> {
  if (postIds === undefined) return
  for (const postId of postIds) {
    const post = await SystemPostRepository.findById(postId)
    if (!post || post.tenantId !== expectedTenantId) throw new Error(`岗位不存在或不属于目标租户: ${postId}`)
    if (post.status !== "ACTIVE") throw new Error(`岗位已停用: ${postId}`)
  }
}

/** Enforce the resolved package-or-tenant seat limit before adding a tenant user. */
async function requireTenantAccountCapacity(): Promise<void> {
  const tenantId = getCurrentTenantId()
  if (!tenantId || isPlatformContext()) return
  const currentCount = await SystemUserRepository.count({ tenantId })
  await TenantEntitlementService.requireUserCapacity(tenantId, currentCount)
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
    const [roleIds, postIds] = await Promise.all([
      SystemPermissionService.getUserRoleIds(id),
      SystemUserRepository.findPostIdsByUserId(id),
    ])
    return { ...rest, roleIds, postIds }
  }

  /** 创建用户 */
  static async create(input: CreateUserInput) {
    // 用户名唯一性检查
    const existing = await SystemUserRepository.findByUsernameInCurrentScope(input.username)
    if (existing) {
      throw new Error(`用户名已存在: ${input.username}`)
    }
    const targetTenantId = getCurrentTenantId() ?? null
    await requireCurrentTenantDept(input.deptId, targetTenantId)
    await requireCurrentTenantPosts(input.postIds, targetTenantId)
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
    if (input.postIds !== undefined) {
      await SystemUserRepository.replacePosts(user.id, input.postIds)
    }

    domainLog.event("system.user.create", { userId: user.id, username: user.username, postCount: input.postIds?.length ?? 0 })
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
      const conflict = await SystemUserRepository.findByUsernameInCurrentScope(input.username)
      if (conflict) {
        throw new Error(`用户名已存在: ${input.username}`)
      }
    }

    await requireCurrentTenantDept(input.deptId, existing.tenantId)
    await requireCurrentTenantPosts(input.postIds, existing.tenantId)

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
    if (input.postIds !== undefined) {
      await SystemUserRepository.replacePosts(input.id, input.postIds)
    }

    domainLog.event("system.user.update", { userId: input.id, postCount: input.postIds?.length })
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

  static async getUser(input: { id: string }) { return this.getById(input.id) }
  static async deleteUser(input: { id: string }) { return this.delete(input.id) }
  static async updateUserStatus(input: { id: string; status: "ACTIVE" | "DISABLED" }) { return this.updateStatus(input.id, input.status) }
}

// Alias for codegen-generated routes
export { SystemUserService as UserService }

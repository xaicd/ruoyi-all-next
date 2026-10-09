/**
 * User Capacity & Tenant Constraint Guards
 */
import { SystemDeptRepository } from "@/modules/system/backend/repositories/dept.repository"
import { SystemPostRepository } from "@/modules/system/backend/repositories/post.repository"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"
import { TenantEntitlementService } from "@/modules/system/backend/services/tenant-entitlement.service"
import { getCurrentTenantId, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"
import { hashPassword, generateSalt } from "@/modules/shared/backend/lib/crypto"

export async function requireCurrentTenantDept(deptId: string | undefined, expectedTenantId: string | null): Promise<void> {
  if (!deptId) return
  const dept = await SystemDeptRepository.findById(deptId)
  if (!dept || dept.tenantId !== expectedTenantId) throw new Error(`部门不存在或不属于目标租户: ${deptId}`)
  if (dept.status !== "ACTIVE") throw new Error(`部门已停用: ${deptId}`)
}

export async function requireCurrentTenantPosts(postIds: string[] | undefined, expectedTenantId: string | null): Promise<void> {
  if (postIds === undefined) return
  for (const postId of postIds) {
    const post = await SystemPostRepository.findById(postId)
    if (!post || post.tenantId !== expectedTenantId) throw new Error(`岗位不存在或不属于目标租户: ${postId}`)
    if (post.status !== "ACTIVE") throw new Error(`岗位已停用: ${postId}`)
  }
}

/** Enforce the resolved package-or-tenant seat limit before adding a tenant user. */
export async function requireTenantAccountCapacity(): Promise<void> {
  const tenantId = getCurrentTenantId()
  if (!tenantId || isPlatformContext()) return
  const currentCount = await SystemUserRepository.count({ tenantId })
  await TenantEntitlementService.requireUserCapacity(tenantId, currentCount)
}

/** 校验当前租户或平台作用域内用户名是否可用 */
export async function assertUsernameAvailable(username: string, excludeId?: string): Promise<void> {
  const existing = await SystemUserRepository.findByUsernameInCurrentScope(username)
  if (existing && existing.id !== excludeId) {
    throw new Error(`用户名已存在: ${username}`)
  }
}

/** 生成双重 MD5+Salt 密码 */
export function encodeUserPassword(password: string): { hashedPassword: string; salt: string } {
  const salt = generateSalt()
  const hashedPassword = hashPassword(password, salt)
  return { hashedPassword, salt }
}

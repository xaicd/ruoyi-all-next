/**
 * SystemUser Repository
 *
 * 双模式实现：
 * - 有真实数据库时 → Kysely 查询
 * - 无数据库时 → 内存存储（开发/演示）
 *
 * Service 层不关心底层用什么数据库，只通过此接口操作数据。
 */

import { hasRealDatabase } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId, isPlatformContext, isPlatformUsername, isTenantRequired } from "@/modules/shared/backend/lib/biz-tenant"
import type { SystemUserRow, CreateUserData, UpdateUserData, UserListParams } from "./user.types"
import {
  findUserListFromMemory,
  findUserByIdFromMemory,
  findUserByUsernameFromMemory,
  createUserDataInMemory,
  updateUserDataInMemory,
  deleteUserDataInMemory,
  countUsersFromMemory,
  getMemoryUserPostIds,
  setMemoryUserPostIds,
} from "./user-memory.store"
import {
  findListFromDb,
  findByIdFromDb,
  findByUsernameFromDb,
  createInDb,
  updateInDb,
  deleteInDb,
  countFromDb,
  findPostIdsFromDb,
  replacePostsInDb,
} from "./user-db.queries"

export type { SystemUserRow, CreateUserData, UpdateUserData, UserListParams } from "./user.types"

/** Uses the verified request context. Explicit tenant IDs are only for pre-auth login lookup. */
function currentTenantId(): string | undefined {
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired() && !isPlatformContext()) throw new Error("用户数据访问缺少租户上下文")
  return undefined
}

export const SystemUserRepository = {
  /** 分页列表 */
  async findList(params: UserListParams): Promise<PageResult<SystemUserRow>> {
    const tenantId = currentTenantId()
    const scopedParams = { ...params, tenantId: tenantId ?? params.tenantId }
    if (hasRealDatabase()) return findListFromDb(scopedParams)
    return findUserListFromMemory(scopedParams)
  },

  /** 按 ID 查找 */
  async findById(id: string): Promise<SystemUserRow | null> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return findByIdFromDb(id, tenantId)
    return findUserByIdFromMemory(id, tenantId)
  },

  /** Pre-auth login lookup. tenantId must come from the validated login request. */
  async findByUsername(username: string, tenantId?: string): Promise<SystemUserRow | null> {
    if (isTenantRequired() && !tenantId && !isPlatformContext() && !isPlatformUsername(username)) {
      throw new Error("登录必须指定 tenantId")
    }
    if (hasRealDatabase()) return findByUsernameFromDb(username, tenantId)
    return findUserByUsernameFromMemory(username, tenantId)
  },

  /** Business lookup scoped to the verified current tenant context. */
  async findByUsernameInCurrentScope(username: string): Promise<SystemUserRow | null> {
    return this.findByUsername(username, currentTenantId())
  },

  /** 创建 */
  async create(data: CreateUserData): Promise<SystemUserRow> {
    const tenantId = currentTenantId()
    const scopedData = { ...data, tenantId: tenantId ?? data.tenantId }
    if (hasRealDatabase()) return createInDb(scopedData)
    return createUserDataInMemory(scopedData)
  },

  /** 更新 */
  async update(id: string, data: UpdateUserData): Promise<SystemUserRow> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return updateInDb(id, data, tenantId)
    return updateUserDataInMemory(id, data, tenantId)
  },

  /** 删除（软删除） */
  async delete(id: string): Promise<void> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return deleteInDb(id, tenantId)
    return deleteUserDataInMemory(id, tenantId)
  },

  /** 读取用户已分配的岗位。 */
  async findPostIdsByUserId(userId: string): Promise<string[]> {
    const user = await this.findById(userId)
    if (!user) throw new Error(`用户不存在: ${userId}`)
    if (!hasRealDatabase()) return getMemoryUserPostIds(userId)
    return findPostIdsFromDb(userId)
  },

  /** Replaces user-post relations atomically in the active tenant scope. */
  async replacePosts(userId: string, postIds: string[]): Promise<void> {
    const user = await this.findById(userId)
    if (!user) throw new Error(`用户不存在: ${userId}`)
    const uniquePostIds = [...new Set(postIds)]
    if (!hasRealDatabase()) {
      setMemoryUserPostIds(userId, uniquePostIds)
      return
    }
    await replacePostsInDb(userId, uniquePostIds)
  },

  /** 统计 */
  async count(params?: { status?: string; tenantId?: string }): Promise<number> {
    const tenantId = currentTenantId()
    const scopedParams = { ...params, tenantId: tenantId ?? params?.tenantId }
    if (hasRealDatabase()) return countFromDb(scopedParams)
    return countUsersFromMemory(scopedParams)
  },
}

export const systemUserRepository = SystemUserRepository

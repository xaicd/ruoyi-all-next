/**
 * MemberUser Repository - C 端会员用户（真实落库，Kysely；SQLite/PG/MySQL 统一）
 *
 * 遵循仓库既有 repository 约定：hasRealDatabase() 时走 Kysely（member_user 表），
 * 否则 MEMORY_STORE 兜底（无真实库的极简场景）。列名 snake_case，自动带 deleted=0。
 *
 * 多租户隔离（AGENTS.md §4.8）：会员按租户隔离，account/email 仅在租户内唯一。
 *   - 已登录路径（findById / updateProfile）从全局上下文 getCurrentTenantId() 取租户；
 *   - 登录/注册路径无上下文，租户来自已验证的登录入参（tenantCode 解析结果），显式传入
 *     tenantId —— 对齐 SystemUserRepository.findByUsername(username, tenantId) 既有姿势；
 *   - 内存实现与真实库实现同语义，禁止「内存不过滤、真实库过滤」。
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId, isPlatformContext, isTenantRequired } from "@/modules/shared/backend/lib/biz-tenant"

export type MemberUserRow = {
  id: string
  account: string
  email: string | null
  passwordHash: string
  passwordSalt: string
  nickname: string
  avatarUrl: string | null
  status: "ACTIVE" | "DISABLED"
  memberLevel: string
  extraFields: Record<string, unknown>
  tenantId: string
  createdAt: string
  updatedAt: string
}

export type CreateMemberUserData = {
  /** 注册时由 tenantCode 解析得到（无上下文场景下租户的唯一合法来源） */
  tenantId: string
  account: string
  email?: string | null
  passwordHash: string
  passwordSalt: string
  nickname: string
  avatarUrl?: string | null
  memberLevel?: string
}

export type UpdateMemberProfileData = {
  nickname?: string
  avatarUrl?: string | null
  extraFields?: Record<string, unknown>
}

function currentTenantId(): string | undefined {
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired() && !isPlatformContext()) throw new Error("会员数据访问缺少租户上下文")
  return undefined
}

function parseExtra(raw: unknown): Record<string, unknown> {
  if (!raw) return {}
  if (typeof raw === "object") return raw as Record<string, unknown>
  try {
    return JSON.parse(String(raw)) as Record<string, unknown>
  } catch {
    return {}
  }
}

const AMBIGUOUS_ACCOUNT_ERROR = "该账号在多个租户下存在，请提供租户标识"

// === 内存兜底（仅无真实库时） ===
const MEMORY_STORE: MemberUserRow[] = []

function newId(): string {
  return `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function mapRow(row: any): MemberUserRow {
  return {
    id: row.id,
    account: row.account,
    email: row.email ?? null,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    nickname: row.nickname,
    avatarUrl: row.avatar_url ?? null,
    status: (row.status as "ACTIVE" | "DISABLED") ?? "ACTIVE",
    memberLevel: row.member_level ?? "normal",
    extraFields: parseExtra(row.extra_fields),
    tenantId: String(row.tenant_id),
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  }
}

export const MemberUserRepository = {
  /**
   * 登录用：按账号查会员。
   *
   * 传入 tenantId 时租户内查找；未传入时跨租户查找，且同一账号命中多个租户即抛错——
   * 宁可要求调用方补租户标识，也不静默取其一（否则等于允许跨租户冒名登录）。
   */
  async findByAccount(account: string, tenantId?: string): Promise<MemberUserRow | null> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db
        .selectFrom("member_user")
        .selectAll()
        .where("account", "=", account)
        .where("deleted", "=", 0 as any)
      if (tenantId) query = query.where("tenant_id", "=", tenantId)
      const rows = await query.limit(2).execute()
      if (rows.length > 1) throw new Error(AMBIGUOUS_ACCOUNT_ERROR)
      return rows[0] ? mapRow(rows[0]) : null
    }
    const matched = MEMORY_STORE.filter(
      (member) => member.account === account && (!tenantId || member.tenantId === tenantId),
    )
    if (matched.length > 1) throw new Error(AMBIGUOUS_ACCOUNT_ERROR)
    return matched[0] ?? null
  },

  /** 已登录路径：按 id 查，租户由全局上下文决定 */
  async findById(id: string): Promise<MemberUserRow | null> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db
        .selectFrom("member_user")
        .selectAll()
        .where("id", "=", id)
        .where("deleted", "=", 0 as any)
      if (tenantId) query = query.where("tenant_id", "=", tenantId)
      const row = await query.executeTakeFirst()
      return row ? mapRow(row) : null
    }
    return (
      MEMORY_STORE.find((member) => member.id === id && (!tenantId || member.tenantId === tenantId)) ?? null
    )
  },

  async insert(data: CreateMemberUserData): Promise<MemberUserRow> {
    const id = newId()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db
        .insertInto("member_user")
        .values({
          id,
          account: data.account,
          email: data.email ?? null,
          password_hash: data.passwordHash,
          password_salt: data.passwordSalt,
          nickname: data.nickname,
          avatar_url: data.avatarUrl ?? null,
          status: "ACTIVE",
          member_level: data.memberLevel ?? "normal",
          tenant_id: data.tenantId,
          updated_at: new Date().toISOString(),
        } as any)
        .returningAll()
        .executeTakeFirstOrThrow()
      return mapRow(row)
    }
    const now = new Date().toISOString()
    const row: MemberUserRow = {
      id,
      account: data.account,
      email: data.email ?? null,
      passwordHash: data.passwordHash,
      passwordSalt: data.passwordSalt,
      nickname: data.nickname,
      avatarUrl: data.avatarUrl ?? null,
      status: "ACTIVE",
      memberLevel: data.memberLevel ?? "normal",
      extraFields: {},
      tenantId: data.tenantId,
      createdAt: now,
      updatedAt: now,
    }
    MEMORY_STORE.push(row)
    return row
  },

  /** 已登录路径：改资料，租户由全局上下文决定 */
  async updateProfile(id: string, patch: UpdateMemberProfileData): Promise<MemberUserRow> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const u: Record<string, any> = { updated_at: new Date().toISOString() }
      if (patch.nickname !== undefined) u.nickname = patch.nickname
      if (patch.avatarUrl !== undefined) u.avatar_url = patch.avatarUrl
      if (patch.extraFields !== undefined) u.extra_fields = JSON.stringify(patch.extraFields)
      let query = db
        .updateTable("member_user")
        .set(u)
        .where("id", "=", id)
        .where("deleted", "=", 0 as any)
      if (tenantId) query = query.where("tenant_id", "=", tenantId)
      const row = await query.returningAll().executeTakeFirstOrThrow()
      return mapRow(row)
    }
    const member = MEMORY_STORE.find(
      (item) => item.id === id && (!tenantId || item.tenantId === tenantId),
    )
    if (!member) throw new Error("会员不存在")
    if (patch.nickname !== undefined) member.nickname = patch.nickname
    if (patch.avatarUrl !== undefined) member.avatarUrl = patch.avatarUrl
    if (patch.extraFields !== undefined) member.extraFields = patch.extraFields
    member.updatedAt = new Date().toISOString()
    return member
  },
}

export const memberUserRepository = MemberUserRepository

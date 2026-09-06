/**
 * MemberUser Repository - C 端会员用户（真实落库，Kysely；SQLite/PG/MySQL 统一）
 *
 * 遵循仓库既有 repository 约定：hasRealDatabase() 时走 Kysely（member_user 表），
 * 否则 MEMORY_STORE 兜底（无真实库的极简场景）。列名 snake_case，自动带 deleted=0。
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

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
  createdAt: string
  updatedAt: string
}

export type CreateMemberUserData = {
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
}

// === 内存兜底（仅无真实库时） ===
const MEMORY_STORE: MemberUserRow[] = []
let memSeq = 1

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
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  }
}

export const MemberUserRepository = {
  async findByAccount(account: string): Promise<MemberUserRow | null> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db
        .selectFrom("member_user")
        .selectAll()
        .where("account", "=", account)
        .where("deleted", "=", 0 as any)
        .executeTakeFirst()
      return row ? mapRow(row) : null
    }
    return MEMORY_STORE.find((m) => m.account === account) ?? null
  },

  async findById(id: string): Promise<MemberUserRow | null> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db
        .selectFrom("member_user")
        .selectAll()
        .where("id", "=", id)
        .where("deleted", "=", 0 as any)
        .executeTakeFirst()
      return row ? mapRow(row) : null
    }
    return MEMORY_STORE.find((m) => m.id === id) ?? null
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
      createdAt: now,
      updatedAt: now,
    }
    MEMORY_STORE.push(row)
    memSeq += 1
    return row
  },

  async updateProfile(id: string, patch: UpdateMemberProfileData): Promise<MemberUserRow> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const u: Record<string, any> = { updated_at: new Date().toISOString() }
      if (patch.nickname !== undefined) u.nickname = patch.nickname
      if (patch.avatarUrl !== undefined) u.avatar_url = patch.avatarUrl
      const row = await db
        .updateTable("member_user")
        .set(u)
        .where("id", "=", id)
        .where("deleted", "=", 0 as any)
        .returningAll()
        .executeTakeFirstOrThrow()
      return mapRow(row)
    }
    const m = MEMORY_STORE.find((x) => x.id === id)
    if (!m) throw new Error("会员不存在")
    if (patch.nickname !== undefined) m.nickname = patch.nickname
    if (patch.avatarUrl !== undefined) m.avatarUrl = patch.avatarUrl
    m.updatedAt = new Date().toISOString()
    return m
  },
}

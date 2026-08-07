/**
 * SystemUser Repository
 *
 * 双模式实现：
 * - 有真实数据库时 → Kysely 查询
 * - 无数据库时 → 内存存储（开发/演示）
 *
 * Service 层不关心底层用什么数据库，只通过此接口操作数据。
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

// === 数据结构 ===

export type SystemUserRow = {
  id: string
  username: string
  nickname: string
  password: string
  phone: string | null
  email: string | null
  avatar: string | null
  status: string
  deptId: string | null
  remark: string | null
  tenantId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateUserData = {
  username: string
  nickname: string
  password: string
  phone?: string
  email?: string
  deptId?: string
  status?: string
  remark?: string
  tenantId?: string
}

export type UpdateUserData = Partial<Omit<CreateUserData, "username">> & {
  username?: string
}

export type UserListParams = {
  page: number
  pageSize: number
  keyword?: string
  status?: string
  deptId?: string
  tenantId?: string
}

// === 内存存储 ===

const MEMORY_STORE: SystemUserRow[] = [
  {
    id: "1",
    username: "admin",
    nickname: "超级管理员",
    password: "$2b$10$hashed_admin123",
    phone: "13800000001",
    email: "admin@ruoyi.local",
    avatar: null,
    status: "ACTIVE",
    deptId: "100",
    remark: "系统内置超级管理员",
    tenantId: "1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    username: "test",
    nickname: "测试用户",
    password: "$2b$10$hashed_test123",
    phone: "13800000002",
    email: "test@ruoyi.local",
    avatar: null,
    status: "ACTIVE",
    deptId: "101",
    remark: "测试账号",
    tenantId: "1",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  },
]

let memoryIdSeq = 100

function generateId(): string {
  return String(++memoryIdSeq)
}

// === Repository 实现 ===

export const SystemUserRepository = {
  /** 分页列表 */
  async findList(params: UserListParams): Promise<PageResult<SystemUserRow>> {
    if (hasRealDatabase()) {
      return findListFromDb(params)
    }
    return findListFromMemory(params)
  },

  /** 按 ID 查找 */
  async findById(id: string): Promise<SystemUserRow | null> {
    if (hasRealDatabase()) {
      return findByIdFromDb(id)
    }
    return MEMORY_STORE.find((u) => u.id === id) ?? null
  },

  /** 按用户名查找 */
  async findByUsername(username: string): Promise<SystemUserRow | null> {
    if (hasRealDatabase()) {
      return findByUsernameFromDb(username)
    }
    return MEMORY_STORE.find((u) => u.username === username) ?? null
  },

  /** 创建 */
  async create(data: CreateUserData): Promise<SystemUserRow> {
    if (hasRealDatabase()) {
      return createInDb(data)
    }
    return createInMemory(data)
  },

  /** 更新 */
  async update(id: string, data: UpdateUserData): Promise<SystemUserRow> {
    if (hasRealDatabase()) {
      return updateInDb(id, data)
    }
    return updateInMemory(id, data)
  },

  /** 删除（软删除） */
  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) {
      return deleteInDb(id)
    }
    return deleteInMemory(id)
  },

  /** 统计 */
  async count(params?: { status?: string; tenantId?: string }): Promise<number> {
    if (hasRealDatabase()) {
      return countFromDb(params)
    }
    let filtered = [...MEMORY_STORE]
    if (params?.status) filtered = filtered.filter((u) => u.status === params.status)
    if (params?.tenantId) filtered = filtered.filter((u) => u.tenantId === params.tenantId)
    return filtered.length
  },
}

// === Kysely 真实 DB 实现 ===

async function findListFromDb(params: UserListParams): Promise<PageResult<SystemUserRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_user").where("deleted", "=", false)

  if (params.keyword) {
    const kw = `%${params.keyword}%`
    query = query.where((eb) =>
      eb.or([
        eb("username", "like", kw),
        eb("nickname", "like", kw),
        eb("phone", "like", kw),
      ]),
    )
  }
  if (params.status) query = query.where("status", "=", params.status)
  if (params.deptId) query = query.where("dept_id", "=", params.deptId)
  if (params.tenantId) query = query.where("tenant_id", "=", params.tenantId)

  const countResult = await query
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .executeTakeFirst()
  const total = Number(countResult?.count ?? 0)

  const offset = (params.page - 1) * params.pageSize
  const rows = await query
    .selectAll()
    .orderBy("created_at", "desc")
    .offset(offset)
    .limit(params.pageSize)
    .execute()

  return {
    items: rows.map(mapDbRow),
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

async function findByIdFromDb(id: string): Promise<SystemUserRow | null> {
  const db = await getKyselyDb()
  const row = await db
    .selectFrom("system_user")
    .selectAll()
    .where("id", "=", id)
    .where("deleted", "=", false)
    .executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function findByUsernameFromDb(username: string): Promise<SystemUserRow | null> {
  const db = await getKyselyDb()
  const row = await db
    .selectFrom("system_user")
    .selectAll()
    .where("username", "=", username)
    .where("deleted", "=", false)
    .executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function createInDb(data: CreateUserData): Promise<SystemUserRow> {
  const db = await getKyselyDb()
  const now = new Date()
  const row = await db
    .insertInto("system_user")
    .values({
      username: data.username,
      nickname: data.nickname,
      password: data.password,
      phone: data.phone ?? null,
      email: data.email ?? null,
      avatar: null,
      status: data.status ?? "ACTIVE",
      dept_id: data.deptId ?? null,
      remark: data.remark ?? null,
      tenant_id: data.tenantId ?? null,
      updated_at: now,
      deleted: false,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function updateInDb(id: string, data: UpdateUserData): Promise<SystemUserRow> {
  const db = await getKyselyDb()
  const updateData: Record<string, any> = { updated_at: new Date() }
  if (data.username !== undefined) updateData.username = data.username
  if (data.nickname !== undefined) updateData.nickname = data.nickname
  if (data.password !== undefined) updateData.password = data.password
  if (data.phone !== undefined) updateData.phone = data.phone
  if (data.email !== undefined) updateData.email = data.email
  if (data.deptId !== undefined) updateData.dept_id = data.deptId
  if (data.status !== undefined) updateData.status = data.status
  if (data.remark !== undefined) updateData.remark = data.remark

  const row = await db
    .updateTable("system_user")
    .set(updateData)
    .where("id", "=", id)
    .where("deleted", "=", false)
    .returningAll()
    .executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  await db
    .updateTable("system_user")
    .set({ deleted: true, updated_at: new Date() })
    .where("id", "=", id)
    .execute()
}

async function countFromDb(params?: { status?: string; tenantId?: string }): Promise<number> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_user").where("deleted", "=", false)
  if (params?.status) query = query.where("status", "=", params.status)
  if (params?.tenantId) query = query.where("tenant_id", "=", params.tenantId)
  const result = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  return Number(result?.count ?? 0)
}

function mapDbRow(row: any): SystemUserRow {
  return {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    password: row.password,
    phone: row.phone,
    email: row.email,
    avatar: row.avatar,
    status: row.status,
    deptId: row.dept_id,
    remark: row.remark,
    tenantId: row.tenant_id,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  }
}

// === 内存实现 ===

function findListFromMemory(params: UserListParams): PageResult<SystemUserRow> {
  let filtered = [...MEMORY_STORE]

  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter(
      (u) =>
        u.username.toLowerCase().includes(kw) ||
        u.nickname.toLowerCase().includes(kw) ||
        (u.phone ?? "").includes(kw) ||
        (u.email ?? "").toLowerCase().includes(kw),
    )
  }
  if (params.status) filtered = filtered.filter((u) => u.status === params.status)
  if (params.deptId) filtered = filtered.filter((u) => u.deptId === params.deptId)
  if (params.tenantId) filtered = filtered.filter((u) => u.tenantId === params.tenantId)

  filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const items = filtered.slice(start, start + params.pageSize)

  return { items, total, page: params.page, pageSize: params.pageSize }
}

function createInMemory(data: CreateUserData): SystemUserRow {
  const now = new Date().toISOString()
  const row: SystemUserRow = {
    id: generateId(),
    username: data.username,
    nickname: data.nickname,
    password: data.password,
    phone: data.phone ?? null,
    email: data.email ?? null,
    avatar: null,
    status: data.status ?? "ACTIVE",
    deptId: data.deptId ?? null,
    remark: data.remark ?? null,
    tenantId: data.tenantId ?? null,
    createdAt: now,
    updatedAt: now,
  }
  MEMORY_STORE.push(row)
  return row
}

function updateInMemory(id: string, data: UpdateUserData): SystemUserRow {
  const idx = MEMORY_STORE.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error(`用户不存在: ${id}`)

  const user = MEMORY_STORE[idx]
  const updated: SystemUserRow = {
    ...user,
    username: data.username ?? user.username,
    nickname: data.nickname ?? user.nickname,
    password: data.password ?? user.password,
    phone: data.phone !== undefined ? (data.phone ?? null) : user.phone,
    email: data.email !== undefined ? (data.email ?? null) : user.email,
    deptId: data.deptId !== undefined ? (data.deptId ?? null) : user.deptId,
    status: data.status ?? user.status,
    remark: data.remark !== undefined ? (data.remark ?? null) : user.remark,
    updatedAt: new Date().toISOString(),
  }
  MEMORY_STORE[idx] = updated
  return updated
}

function deleteInMemory(id: string): void {
  const idx = MEMORY_STORE.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error(`用户不存在: ${id}`)
  MEMORY_STORE.splice(idx, 1)
}

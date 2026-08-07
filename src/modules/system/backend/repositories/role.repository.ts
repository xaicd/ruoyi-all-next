/**
 * SystemRole Repository
 * 双模式：真实 DB (Kysely) / 内存存储
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type SystemRoleRow = {
  id: string
  name: string
  code: string
  sort: number
  status: string
  dataScope: string
  remark: string | null
  tenantId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateRoleData = {
  name: string
  code: string
  sort?: number
  status?: string
  dataScope?: string
  remark?: string
}

export type UpdateRoleData = Partial<CreateRoleData>

export type RoleListParams = {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}

// === 内存存储 ===
const MEMORY_STORE: SystemRoleRow[] = [
  {
    id: "1",
    name: "超级管理员",
    code: "super_admin",
    sort: 1,
    status: "ACTIVE",
    dataScope: "ALL",
    remark: "系统内置超级管理员角色",
    tenantId: "1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "普通角色",
    code: "common",
    sort: 2,
    status: "ACTIVE",
    dataScope: "SELF",
    remark: "普通员工角色",
    tenantId: "1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]

let memoryIdSeq = 100

export const SystemRoleRepository = {
  async findList(params: RoleListParams): Promise<PageResult<SystemRoleRow>> {
    if (hasRealDatabase()) return findListFromDb(params)
    return findListFromMemory(params)
  },

  async findById(id: string): Promise<SystemRoleRow | null> {
    if (hasRealDatabase()) return findByIdFromDb(id)
    return MEMORY_STORE.find((r) => r.id === id) ?? null
  },

  async findByCode(code: string): Promise<SystemRoleRow | null> {
    if (hasRealDatabase()) return findByCodeFromDb(code)
    return MEMORY_STORE.find((r) => r.code === code) ?? null
  },

  async create(data: CreateRoleData): Promise<SystemRoleRow> {
    if (hasRealDatabase()) return createInDb(data)
    return createInMemory(data)
  },

  async update(id: string, data: UpdateRoleData): Promise<SystemRoleRow> {
    if (hasRealDatabase()) return updateInDb(id, data)
    return updateInMemory(id, data)
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    return deleteInMemory(id)
  },
}

// === Kysely DB 实现 ===

async function findListFromDb(params: RoleListParams): Promise<PageResult<SystemRoleRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_role").where("deleted", "=", false)

  if (params.keyword) {
    const kw = `%${params.keyword}%`
    query = query.where((eb) => eb.or([eb("name", "like", kw), eb("code", "like", kw)]))
  }
  if (params.status) query = query.where("status", "=", params.status)

  const countResult = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  const total = Number(countResult?.count ?? 0)

  const offset = (params.page - 1) * params.pageSize
  const rows = await query.selectAll().orderBy("sort", "asc").offset(offset).limit(params.pageSize).execute()

  return { items: rows.map(mapDbRow), total, page: params.page, pageSize: params.pageSize }
}

async function findByIdFromDb(id: string): Promise<SystemRoleRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_role").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function findByCodeFromDb(code: string): Promise<SystemRoleRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_role").selectAll().where("code", "=", code).where("deleted", "=", false).executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function createInDb(data: CreateRoleData): Promise<SystemRoleRow> {
  const db = await getKyselyDb()
  const row = await db.insertInto("system_role").values({
    name: data.name,
    code: data.code,
    sort: data.sort ?? 0,
    status: data.status ?? "ACTIVE",
    data_scope: data.dataScope ?? "ALL",
    remark: data.remark ?? null,
    tenant_id: null,
    updated_at: new Date(),
    deleted: false,
  }).returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function updateInDb(id: string, data: UpdateRoleData): Promise<SystemRoleRow> {
  const db = await getKyselyDb()
  const updateData: Record<string, any> = { updated_at: new Date() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.code !== undefined) updateData.code = data.code
  if (data.sort !== undefined) updateData.sort = data.sort
  if (data.status !== undefined) updateData.status = data.status
  if (data.dataScope !== undefined) updateData.data_scope = data.dataScope
  if (data.remark !== undefined) updateData.remark = data.remark

  const row = await db.updateTable("system_role").set(updateData).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  await db.updateTable("system_role").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).execute()
}

function mapDbRow(row: any): SystemRoleRow {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    sort: row.sort,
    status: row.status,
    dataScope: row.data_scope,
    remark: row.remark,
    tenantId: row.tenant_id,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  }
}

// === 内存实现 ===

function findListFromMemory(params: RoleListParams): PageResult<SystemRoleRow> {
  let filtered = [...MEMORY_STORE]
  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(kw) || r.code.toLowerCase().includes(kw))
  }
  if (params.status) filtered = filtered.filter((r) => r.status === params.status)
  filtered.sort((a, b) => a.sort - b.sort)

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
}

function createInMemory(data: CreateRoleData): SystemRoleRow {
  const now = new Date().toISOString()
  const row: SystemRoleRow = {
    id: String(++memoryIdSeq),
    name: data.name,
    code: data.code,
    sort: data.sort ?? 0,
    status: data.status ?? "ACTIVE",
    dataScope: data.dataScope ?? "ALL",
    remark: data.remark ?? null,
    tenantId: null,
    createdAt: now,
    updatedAt: now,
  }
  MEMORY_STORE.push(row)
  return row
}

function updateInMemory(id: string, data: UpdateRoleData): SystemRoleRow {
  const idx = MEMORY_STORE.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error(`角色不存在: ${id}`)
  const role = MEMORY_STORE[idx]
  const updated: SystemRoleRow = {
    ...role,
    name: data.name ?? role.name,
    code: data.code ?? role.code,
    sort: data.sort ?? role.sort,
    status: data.status ?? role.status,
    dataScope: data.dataScope ?? role.dataScope,
    remark: data.remark !== undefined ? (data.remark ?? null) : role.remark,
    updatedAt: new Date().toISOString(),
  }
  MEMORY_STORE[idx] = updated
  return updated
}

function deleteInMemory(id: string): void {
  const idx = MEMORY_STORE.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error(`角色不存在: ${id}`)
  if (MEMORY_STORE[idx].code === "super_admin") throw new Error("不允许删除超级管理员角色")
  MEMORY_STORE.splice(idx, 1)
}

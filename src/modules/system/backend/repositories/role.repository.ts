/**
 * SystemRole Repository
 * 双模式：真实 DB (Kysely) / 内存存储
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId, isPlatformContext, isTenantRequired } from "@/modules/shared/backend/lib/biz-tenant"
import { SEED_ROLES } from "@prisma/data"

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
function currentTenantId(): string | undefined {
  // Platform control-plane users may own a tenant for bootstrap purposes while
  // still needing to resolve both tenant-local and global role templates.
  if (isPlatformContext()) return undefined
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired()) throw new Error("角色数据访问缺少租户上下文")
  return undefined
}

const MEMORY_STORE: SystemRoleRow[] = [...SEED_ROLES]

let memoryIdSeq = 100

export const SystemRoleRepository = {
  async findList(params: RoleListParams): Promise<PageResult<SystemRoleRow>> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return findListFromDb(params, tenantId)
    return findListFromMemory(params, tenantId)
  },

  async findById(id: string): Promise<SystemRoleRow | null> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return findByIdFromDb(id, tenantId)
    return MEMORY_STORE.find((r) => r.id === id && (!tenantId || r.tenantId === tenantId)) ?? null
  },

  async findByCode(code: string): Promise<SystemRoleRow | null> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return findByCodeFromDb(code, tenantId)
    return MEMORY_STORE.find((r) => r.code === code && (!tenantId || r.tenantId === tenantId)) ?? null
  },

  async create(data: CreateRoleData): Promise<SystemRoleRow> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return createInDb(data, tenantId)
    return createInMemory(data, tenantId)
  },

  async update(id: string, data: UpdateRoleData): Promise<SystemRoleRow> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return updateInDb(id, data, tenantId)
    return updateInMemory(id, data, tenantId)
  },

  async delete(id: string): Promise<void> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return deleteInDb(id, tenantId)
    return deleteInMemory(id, tenantId)
  },
}

// === Kysely DB 实现 ===

async function findListFromDb(params: RoleListParams, tenantId?: string): Promise<PageResult<SystemRoleRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_role").where("deleted", "=", false)

  if (params.keyword) {
    const kw = `%${params.keyword}%`
    query = query.where((eb) => eb.or([eb("name", "like", kw), eb("code", "like", kw)]))
  }
  if (params.status) query = query.where("status", "=", params.status)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)

  const countResult = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  const total = Number(countResult?.count ?? 0)

  const offset = (params.page - 1) * params.pageSize
  const rows = await query.selectAll().orderBy("sort", "asc").offset(offset).limit(params.pageSize).execute()

  return { items: rows.map(mapDbRow), total, page: params.page, pageSize: params.pageSize }
}

async function findByIdFromDb(id: string, tenantId?: string): Promise<SystemRoleRow | null> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_role").selectAll().where("id", "=", id).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function findByCodeFromDb(code: string, tenantId?: string): Promise<SystemRoleRow | null> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_role").selectAll().where("code", "=", code).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function createInDb(data: CreateRoleData, tenantId?: string): Promise<SystemRoleRow> {
  const db = await getKyselyDb()
  const row = await db.insertInto("system_role").values({
    name: data.name,
    code: data.code,
    sort: data.sort ?? 0,
    status: data.status ?? "ACTIVE",
    data_scope: data.dataScope ?? "ALL",
    remark: data.remark ?? null,
    tenant_id: tenantId ?? null,
    updated_at: new Date(),
    deleted: false,
  } as any).returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function updateInDb(id: string, data: UpdateRoleData, tenantId?: string): Promise<SystemRoleRow> {
  const db = await getKyselyDb()
  const updateData: Record<string, any> = { updated_at: new Date() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.code !== undefined) updateData.code = data.code
  if (data.sort !== undefined) updateData.sort = data.sort
  if (data.status !== undefined) updateData.status = data.status
  if (data.dataScope !== undefined) updateData.data_scope = data.dataScope
  if (data.remark !== undefined) updateData.remark = data.remark

  let query = db.updateTable("system_role").set(updateData).where("id", "=", id).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function deleteInDb(id: string, tenantId?: string): Promise<void> {
  const db = await getKyselyDb()
  let query = db.updateTable("system_role").set({ deleted: true, updated_at: new Date() }).where("id", "=", id)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  await query.execute()
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

function findListFromMemory(params: RoleListParams, tenantId?: string): PageResult<SystemRoleRow> {
  let filtered = [...MEMORY_STORE]
  if (tenantId) filtered = filtered.filter((r) => r.tenantId === tenantId)
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

function createInMemory(data: CreateRoleData, tenantId?: string): SystemRoleRow {
  const now = new Date().toISOString()
  const row: SystemRoleRow = {
    id: String(++memoryIdSeq),
    name: data.name,
    code: data.code,
    sort: data.sort ?? 0,
    status: data.status ?? "ACTIVE",
    dataScope: data.dataScope ?? "ALL",
    remark: data.remark ?? null,
    tenantId: tenantId ?? null,
    createdAt: now,
    updatedAt: now,
  }
  MEMORY_STORE.push(row)
  return row
}

function updateInMemory(id: string, data: UpdateRoleData, tenantId?: string): SystemRoleRow {
  const idx = MEMORY_STORE.findIndex((r) => r.id === id && (!tenantId || r.tenantId === tenantId))
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

function deleteInMemory(id: string, tenantId?: string): void {
  const idx = MEMORY_STORE.findIndex((r) => r.id === id && (!tenantId || r.tenantId === tenantId))
  if (idx === -1) throw new Error(`角色不存在: ${id}`)
  if (MEMORY_STORE[idx].code === "super_admin") throw new Error("不允许删除超级管理员角色")
  MEMORY_STORE.splice(idx, 1)
}

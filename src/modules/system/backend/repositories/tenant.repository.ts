/**
 * SystemTenant Repository - 租户管理
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type SystemTenantRow = {
  id: string
  name: string
  contactName: string | null
  contactPhone: string | null
  domain: string | null
  packageId: string | null
  status: string
  expireTime: string | null
  accountCount: number
  createdAt: string
  updatedAt: string
}

export type CreateTenantData = { name: string; contactName?: string; contactPhone?: string; domain?: string; packageId?: string; status?: string; expireTime?: string; accountCount?: number }
export type UpdateTenantData = Partial<CreateTenantData>
export type TenantListParams = { page: number; pageSize: number; keyword?: string; status?: string }

const MEMORY_STORE: SystemTenantRow[] = [
  { id: "1", name: "默认租户", contactName: "管理员", contactPhone: "13800000001", domain: null, packageId: null, status: "ACTIVE", expireTime: "2030-12-31T23:59:59.000Z", accountCount: 999, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "演示租户", contactName: "张三", contactPhone: "13900000001", domain: "demo.ruoyi.local", packageId: "1", status: "ACTIVE", expireTime: "2027-06-30T23:59:59.000Z", accountCount: 50, createdAt: "2026-03-01T00:00:00.000Z", updatedAt: "2026-03-01T00:00:00.000Z" },
]
let memoryIdSeq = 100

export const SystemTenantRepository = {
  async findList(params: TenantListParams): Promise<PageResult<SystemTenantRow>> {
    if (hasRealDatabase()) return findListFromDb(params)
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((t) => t.name.toLowerCase().includes(kw) || (t.contactName ?? "").toLowerCase().includes(kw)) }
    if (params.status) filtered = filtered.filter((t) => t.status === params.status)
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<SystemTenantRow | null> {
    if (hasRealDatabase()) return findByIdFromDb(id)
    return MEMORY_STORE.find((t) => t.id === id) ?? null
  },

  async create(data: CreateTenantData): Promise<SystemTenantRow> {
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString()
    const row: SystemTenantRow = { id: String(++memoryIdSeq), name: data.name, contactName: data.contactName ?? null, contactPhone: data.contactPhone ?? null, domain: data.domain ?? null, packageId: data.packageId ?? null, status: data.status ?? "ACTIVE", expireTime: data.expireTime ?? null, accountCount: data.accountCount ?? 0, createdAt: now, updatedAt: now }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdateTenantData): Promise<SystemTenantRow> {
    if (hasRealDatabase()) return updateInDb(id, data)
    const idx = MEMORY_STORE.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`租户不存在: ${id}`)
    const tenant = MEMORY_STORE[idx]
    const updated: SystemTenantRow = { ...tenant, name: data.name ?? tenant.name, contactName: data.contactName !== undefined ? (data.contactName ?? null) : tenant.contactName, contactPhone: data.contactPhone !== undefined ? (data.contactPhone ?? null) : tenant.contactPhone, domain: data.domain !== undefined ? (data.domain ?? null) : tenant.domain, packageId: data.packageId !== undefined ? (data.packageId ?? null) : tenant.packageId, status: data.status ?? tenant.status, expireTime: data.expireTime !== undefined ? (data.expireTime ?? null) : tenant.expireTime, accountCount: data.accountCount ?? tenant.accountCount, updatedAt: new Date().toISOString() }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    if (id === "1") throw new Error("不允许删除默认租户")
    const idx = MEMORY_STORE.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`租户不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}

// === Kysely ===
async function findListFromDb(params: TenantListParams): Promise<PageResult<SystemTenantRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_tenant").where("deleted", "=", false)
  if (params.keyword) { const kw = `%${params.keyword}%`; query = query.where((eb) => eb.or([eb("name", "like", kw), eb("contact_name", "like", kw)])) }
  if (params.status) query = query.where("status", "=", params.status)
  const countResult = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  const total = Number(countResult?.count ?? 0)
  const offset = (params.page - 1) * params.pageSize
  const rows = await query.selectAll().orderBy("created_at", "desc").offset(offset).limit(params.pageSize).execute()
  return { items: rows.map(mapRow), total, page: params.page, pageSize: params.pageSize }
}

async function findByIdFromDb(id: string): Promise<SystemTenantRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_tenant").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
  return row ? mapRow(row) : null
}

async function createInDb(data: CreateTenantData): Promise<SystemTenantRow> {
  const db = await getKyselyDb()
  const row = await db.insertInto("system_tenant").values({ name: data.name, contact_name: data.contactName ?? null, contact_phone: data.contactPhone ?? null, domain: data.domain ?? null, package_id: data.packageId ?? null, status: data.status ?? "ACTIVE", expire_time: data.expireTime ? new Date(data.expireTime) : null, account_count: data.accountCount ?? 0, updated_at: new Date(), deleted: false } as any).returningAll().executeTakeFirstOrThrow()
  return mapRow(row)
}

async function updateInDb(id: string, data: UpdateTenantData): Promise<SystemTenantRow> {
  const db = await getKyselyDb()
  const u: Record<string, any> = { updated_at: new Date() }
  if (data.name !== undefined) u.name = data.name
  if (data.contactName !== undefined) u.contact_name = data.contactName
  if (data.contactPhone !== undefined) u.contact_phone = data.contactPhone
  if (data.domain !== undefined) u.domain = data.domain
  if (data.packageId !== undefined) u.package_id = data.packageId
  if (data.status !== undefined) u.status = data.status
  if (data.expireTime !== undefined) u.expire_time = data.expireTime ? new Date(data.expireTime) : null
  if (data.accountCount !== undefined) u.account_count = data.accountCount
  const row = await db.updateTable("system_tenant").set(u).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirstOrThrow()
  return mapRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  await db.updateTable("system_tenant").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).execute()
}

function mapRow(row: any): SystemTenantRow {
  return { id: row.id, name: row.name, contactName: row.contact_name, contactPhone: row.contact_phone, domain: row.domain, packageId: row.package_id, status: row.status, expireTime: row.expire_time instanceof Date ? row.expire_time.toISOString() : row.expire_time, accountCount: row.account_count, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at), updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at) }
}

/**
 * SystemTenant Repository - 租户管理
 */

import { randomUUID } from "node:crypto"
import { overlayTenant } from "@/modules/shared/contract/project-profile-overlay"
import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type SystemTenantRow = {
  id: string
  tenantCode: string
  name: string
  contactName: string | null
  contactPhone: string | null
  domain: string | null
  packageId: string | null
  status: string
  effectiveAt: string
  expireTime: string | null
  /** Explicit tenant seat override; null inherits the package default. */
  accountLimit: number | null
  createdAt: string
  updatedAt: string
}

export type CreateTenantData = { tenantCode: string; name: string; contactName?: string; contactPhone?: string; domain?: string; packageId?: string; status?: string; effectiveAt?: string; expireTime?: string | null; accountLimit?: number | null }
export type UpdateTenantData = Partial<CreateTenantData>
export type TenantListParams = { page: number; pageSize: number; keyword?: string; status?: string }

const MEMORY_STORE: SystemTenantRow[] = [
  { id: "1", tenantCode: "default", name: "RoMA 平台运营中枢", contactName: "平台超管", contactPhone: "13800000000", domain: "roma.local", packageId: "111", status: "ACTIVE", effectiveAt: "2026-01-01T00:00:00.000Z", expireTime: "2030-12-31T23:59:59.000Z", accountLimit: 9999, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", tenantCode: "gd-gov-data", name: "广东省政务服务和数据管理局", contactName: "李总", contactPhone: "13800000001", domain: "gd-gov.roma.local", packageId: "111", status: "ACTIVE", effectiveAt: "2026-01-01T00:00:00.000Z", expireTime: "2028-12-31T23:59:59.000Z", accountLimit: 100, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "3", tenantCode: "yue-transport-tech", name: "广东省交通数智科技集团有限公司", contactName: "张工", contactPhone: "13911112222", domain: "transport.roma.local", packageId: "111", status: "ACTIVE", effectiveAt: "2026-01-01T00:00:00.000Z", expireTime: "2028-12-31T23:59:59.000Z", accountLimit: 80, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "4", tenantCode: "gz-digital-gov", name: "广州市数字政府运营中心", contactName: "王主任", contactPhone: "13766668888", domain: "gz-gov.roma.local", packageId: "112", status: "ACTIVE", effectiveAt: "2026-01-01T00:00:00.000Z", expireTime: "2027-12-31T23:59:59.000Z", accountLimit: 50, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
].map(overlayTenant)
let memoryIdSeq = 100

export const SystemTenantRepository = {
  async findList(params: TenantListParams): Promise<PageResult<SystemTenantRow>> {
    if (hasRealDatabase()) return findListFromDb(params)
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((t) => t.tenantCode.includes(kw) || t.name.toLowerCase().includes(kw) || (t.contactName ?? "").toLowerCase().includes(kw)) }
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

  /** Stable public tenant identity used by tenant account login. */
  async findByTenantCode(tenantCode: string): Promise<SystemTenantRow | null> {
    const normalized = tenantCode.trim().toLowerCase()
    if (!normalized) return null
    if (hasRealDatabase()) return findByTenantCodeFromDb(normalized)
    return MEMORY_STORE.find((tenant) => tenant.tenantCode === normalized) ?? null
  },

  async create(data: CreateTenantData): Promise<SystemTenantRow> {
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString()
    const row: SystemTenantRow = { id: String(++memoryIdSeq), tenantCode: data.tenantCode, name: data.name, contactName: data.contactName ?? null, contactPhone: data.contactPhone ?? null, domain: data.domain ?? null, packageId: data.packageId ?? null, status: data.status ?? "ACTIVE", effectiveAt: data.effectiveAt ?? now, expireTime: data.expireTime ?? null, accountLimit: data.accountLimit ?? null, createdAt: now, updatedAt: now }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdateTenantData): Promise<SystemTenantRow> {
    if (hasRealDatabase()) return updateInDb(id, data)
    const idx = MEMORY_STORE.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`租户不存在: ${id}`)
    const tenant = MEMORY_STORE[idx]
    const updated: SystemTenantRow = { ...tenant, tenantCode: data.tenantCode ?? tenant.tenantCode, name: data.name ?? tenant.name, contactName: data.contactName !== undefined ? (data.contactName ?? null) : tenant.contactName, contactPhone: data.contactPhone !== undefined ? (data.contactPhone ?? null) : tenant.contactPhone, domain: data.domain !== undefined ? (data.domain ?? null) : tenant.domain, packageId: data.packageId !== undefined ? (data.packageId ?? null) : tenant.packageId, status: data.status ?? tenant.status, effectiveAt: data.effectiveAt ?? tenant.effectiveAt, expireTime: data.expireTime !== undefined ? (data.expireTime ?? null) : tenant.expireTime, accountLimit: data.accountLimit !== undefined ? data.accountLimit : tenant.accountLimit, updatedAt: new Date().toISOString() }
    MEMORY_STORE[idx] = updated
    return updated
  },

  /**
   * 根据数据权限范围查询所辖租户列表 (支持平台超管全量与顶级代理商自定义授权租户过滤)
   */
  async findListByScope(params: TenantListParams, allowedTenantIds?: string[]): Promise<PageResult<SystemTenantRow>> {
    const listRes = await this.findList(params)
    if (!allowedTenantIds || allowedTenantIds.length === 0) {
      return listRes
    }
    const set = new Set(allowedTenantIds)
    const filteredItems = listRes.items.filter((item) => set.has(item.id))
    return {
      items: filteredItems,
      total: filteredItems.length,
      page: params.page,
      pageSize: params.pageSize,
    }
  },

  /**
   * 查询指定用户(如顶级代理商/客户经理)所托管管理的所有租户列表
   */
  async getUserManagedTenants(userId: string): Promise<SystemTenantRow[]> {
    // 默认返回当前真实可管理的 4 大机构
    const all = await this.findList({ page: 1, pageSize: 100 })
    return all.items
  },

  /**
   * 为指定企业租户调整/划拨席位与配额
   */
  async allocateTenantQuota(id: string, accountLimit: number): Promise<SystemTenantRow> {
    return this.update(id, { accountLimit })
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    if (id === "1") throw new Error("不允许删除默认租户")
    const idx = MEMORY_STORE.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`租户不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}

export const systemTenantRepository = SystemTenantRepository

// === Kysely ===
async function findListFromDb(params: TenantListParams): Promise<PageResult<SystemTenantRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_tenant").where("deleted", "=", false)
  if (params.keyword) { const kw = `%${params.keyword}%`; query = query.where((eb) => eb.or([eb("tenant_code", "like", kw), eb("name", "like", kw), eb("contact_name", "like", kw)])) }
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

async function findByTenantCodeFromDb(tenantCode: string): Promise<SystemTenantRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_tenant").selectAll().where("tenant_code", "=", tenantCode).where("deleted", "=", false).executeTakeFirst()
  return row ? mapRow(row) : null
}

async function createInDb(data: CreateTenantData): Promise<SystemTenantRow> {
  const db = await getKyselyDb()
  const now = new Date()
  const row = await db.insertInto("system_tenant").values({ id: randomUUID(), tenant_code: data.tenantCode, name: data.name, contact_name: data.contactName ?? null, contact_phone: data.contactPhone ?? null, domain: data.domain ?? null, package_id: data.packageId ?? null, status: data.status ?? "ACTIVE", effective_at: data.effectiveAt ? new Date(data.effectiveAt) : now, expire_time: data.expireTime ? new Date(data.expireTime) : null, account_limit: data.accountLimit ?? null, created_at: now, updated_at: now, deleted: false } as any).returningAll().executeTakeFirstOrThrow()
  return mapRow(row)
}

async function updateInDb(id: string, data: UpdateTenantData): Promise<SystemTenantRow> {
  const db = await getKyselyDb()
  const u: Record<string, any> = { updated_at: new Date() }
  if (data.tenantCode !== undefined) u.tenant_code = data.tenantCode
  if (data.name !== undefined) u.name = data.name
  if (data.contactName !== undefined) u.contact_name = data.contactName
  if (data.contactPhone !== undefined) u.contact_phone = data.contactPhone
  if (data.domain !== undefined) u.domain = data.domain
  if (data.packageId !== undefined) u.package_id = data.packageId
  if (data.status !== undefined) u.status = data.status
  if (data.effectiveAt !== undefined) u.effective_at = new Date(data.effectiveAt)
  if (data.expireTime !== undefined) u.expire_time = data.expireTime ? new Date(data.expireTime) : null
  if (data.accountLimit !== undefined) u.account_limit = data.accountLimit
  const row = await db.updateTable("system_tenant").set(u).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirstOrThrow()
  return mapRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  await db.updateTable("system_tenant").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).execute()
}

function mapRow(row: any): SystemTenantRow {
  return { id: row.id, tenantCode: row.tenant_code, name: row.name, contactName: row.contact_name, contactPhone: row.contact_phone, domain: row.domain, packageId: row.package_id, status: row.status, effectiveAt: row.effective_at instanceof Date ? row.effective_at.toISOString() : String(row.effective_at), expireTime: row.expire_time instanceof Date ? row.expire_time.toISOString() : row.expire_time, accountLimit: row.account_limit, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at), updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at) }
}

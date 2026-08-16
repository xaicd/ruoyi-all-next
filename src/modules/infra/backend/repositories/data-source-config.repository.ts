import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"

export type DataSourceConfigRow = {
  id: string; tenantId: string | null; name: string; driver: string; url: string; username: string; encryptedPassword: string
  remark: string | null; createdAt: string; updatedAt: string
}
export type CreateDataSourceConfigRow = Omit<DataSourceConfigRow, "id" | "createdAt" | "updatedAt">
export type UpdateDataSourceConfigRow = Partial<Omit<CreateDataSourceConfigRow, "encryptedPassword" | "tenantId">> & { encryptedPassword?: string }
export type DataSourceConfigPageParams = { tenantId: string; page: number; pageSize: number; keyword?: string }

const MEMORY_STORE: DataSourceConfigRow[] = []

/** Tenant-owned data sources. All methods require the owner scope, preventing ID guessing across tenants. */
export const DataSourceConfigRepository = {
  async findPage(params: DataSourceConfigPageParams) {
    if (hasRealDatabase()) return findPageFromDb(params)
    let rows = MEMORY_STORE.filter((row) => row.tenantId === params.tenantId)
    if (params.keyword) { const keyword = params.keyword.toLowerCase(); rows = rows.filter((row) => row.name.toLowerCase().includes(keyword) || row.driver.toLowerCase().includes(keyword) || row.url.toLowerCase().includes(keyword)) }
    rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    const total = rows.length; const start = (params.page - 1) * params.pageSize
    return { items: rows.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },
  async findById(tenantId: string, id: string) {
    if (hasRealDatabase()) return findByIdFromDb(tenantId, id)
    return MEMORY_STORE.find((row) => row.id === id && row.tenantId === tenantId) ?? null
  },
  async create(data: CreateDataSourceConfigRow) {
    if (!data.tenantId) throw new Error("数据源必须指定归属租户")
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString(); const row: DataSourceConfigRow = { ...data, id: randomUUID(), createdAt: now, updatedAt: now }; MEMORY_STORE.push(row); return row
  },
  async update(tenantId: string, id: string, data: UpdateDataSourceConfigRow) {
    if (hasRealDatabase()) return updateInDb(tenantId, id, data)
    const index = MEMORY_STORE.findIndex((row) => row.id === id && row.tenantId === tenantId)
    if (index < 0) throw new Error("数据源不存在")
    const row = { ...MEMORY_STORE[index], ...data, updatedAt: new Date().toISOString() }; MEMORY_STORE[index] = row; return row
  },
  async softDelete(tenantId: string, id: string) {
    if (hasRealDatabase()) { const db = await getKyselyDb(); const result = await db.updateTable("infra_data_source_config").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).where("tenant_id", "=", tenantId).where("deleted", "=", false).executeTakeFirst(); if (Number(result.numUpdatedRows) !== 1) throw new Error("数据源不存在"); return }
    const index = MEMORY_STORE.findIndex((row) => row.id === id && row.tenantId === tenantId); if (index < 0) throw new Error("数据源不存在"); MEMORY_STORE.splice(index, 1)
  },
}

async function findPageFromDb(params: DataSourceConfigPageParams) {
  const db = await getKyselyDb(); let query = db.selectFrom("infra_data_source_config").where("tenant_id", "=", params.tenantId).where("deleted", "=", false)
  if (params.keyword) { const keyword = `%${params.keyword}%`; query = query.where((eb) => eb.or([eb("name", "like", keyword), eb("driver", "like", keyword), eb("url", "like", keyword)])) }
  const count = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst(); const rows = await query.selectAll().orderBy("updated_at", "desc").offset((params.page - 1) * params.pageSize).limit(params.pageSize).execute()
  return { items: rows.map(mapRow), total: Number(count?.count ?? 0), page: params.page, pageSize: params.pageSize }
}
async function findByIdFromDb(tenantId: string, id: string) { const db = await getKyselyDb(); const row = await db.selectFrom("infra_data_source_config").selectAll().where("id", "=", id).where("tenant_id", "=", tenantId).where("deleted", "=", false).executeTakeFirst(); return row ? mapRow(row) : null }
async function createInDb(data: CreateDataSourceConfigRow) { const db = await getKyselyDb(); const row = await db.insertInto("infra_data_source_config").values({ id: randomUUID(), tenant_id: data.tenantId!, name: data.name, driver: data.driver, url: data.url, username: data.username, encrypted_password: data.encryptedPassword, remark: data.remark ?? null, created_at: new Date(), deleted: false, updated_at: new Date() }).returningAll().executeTakeFirstOrThrow(); return mapRow(row) }
async function updateInDb(tenantId: string, id: string, data: UpdateDataSourceConfigRow) { const db = await getKyselyDb(); const patch: Record<string, unknown> = { updated_at: new Date() }; if (data.name !== undefined) patch.name = data.name; if (data.driver !== undefined) patch.driver = data.driver; if (data.url !== undefined) patch.url = data.url; if (data.username !== undefined) patch.username = data.username; if (data.encryptedPassword !== undefined) patch.encrypted_password = data.encryptedPassword; if (data.remark !== undefined) patch.remark = data.remark; const row = await db.updateTable("infra_data_source_config").set(patch as any).where("id", "=", id).where("tenant_id", "=", tenantId).where("deleted", "=", false).returningAll().executeTakeFirst(); if (!row) throw new Error("数据源不存在"); return mapRow(row) }
function mapRow(row: any): DataSourceConfigRow { return { id: String(row.id), tenantId: row.tenant_id ?? null, name: row.name, driver: row.driver, url: row.url, username: row.username, encryptedPassword: row.encrypted_password, remark: row.remark ?? null, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at), updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at) } }
/**
 * SystemTenantPackage Repository - 租户套餐
 * 内存模式供无数据库的开发启动使用；真实数据库使用持久化套餐及菜单关联。
 */

import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase, type PageResult } from "@/modules/shared/backend/lib/database"

export type TenantPackageRow = {
  id: string
  name: string
  status: string
  menuIds: string[]
  remark: string | null
  createdAt: string
  updatedAt: string
}

export type CreateTenantPackageData = { name: string; status?: string; menuIds?: string[]; remark?: string }
export type UpdateTenantPackageData = Partial<CreateTenantPackageData>

const MEMORY_STORE: TenantPackageRow[] = [
  { id: "1", name: "基础版", status: "ACTIVE", menuIds: ["1", "100", "101", "102", "103", "104", "105", "1001", "1002", "1003"], remark: "基础系统管理功能", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "专业版", status: "ACTIVE", menuIds: ["1", "2", "100", "101", "102", "103", "104", "105", "1001", "1002", "1003"], remark: "系统管理 + 基础设施", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "3", name: "旗舰版", status: "ACTIVE", menuIds: [], remark: "全部功能（未配置菜单即为全部）", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
]
let memoryIdSeq = 100

export const TenantPackageRepository = {
  async findList(params: { page: number; pageSize: number; keyword?: string }): Promise<PageResult<TenantPackageRow>> {
    if (hasRealDatabase()) return findListFromDb(params)
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const keyword = params.keyword.toLowerCase(); filtered = filtered.filter((item) => item.name.toLowerCase().includes(keyword)) }
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findAll(): Promise<TenantPackageRow[]> {
    if (hasRealDatabase()) return findAllFromDb()
    return [...MEMORY_STORE]
  },

  async findById(id: string): Promise<TenantPackageRow | null> {
    if (hasRealDatabase()) return findByIdFromDb(id)
    return MEMORY_STORE.find((item) => item.id === id) ?? null
  },

  async create(data: CreateTenantPackageData): Promise<TenantPackageRow> {
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString()
    const row: TenantPackageRow = { id: String(++memoryIdSeq), name: data.name, status: data.status ?? "ACTIVE", menuIds: uniqueIds(data.menuIds ?? []), remark: data.remark ?? null, createdAt: now, updatedAt: now }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdateTenantPackageData): Promise<TenantPackageRow> {
    if (hasRealDatabase()) return updateInDb(id, data)
    const index = MEMORY_STORE.findIndex((item) => item.id === id)
    if (index === -1) throw new Error(`套餐不存在: ${id}`)
    const current = MEMORY_STORE[index]
    const updated: TenantPackageRow = { ...current, name: data.name ?? current.name, status: data.status ?? current.status, menuIds: data.menuIds === undefined ? current.menuIds : uniqueIds(data.menuIds), remark: data.remark === undefined ? current.remark : data.remark ?? null, updatedAt: new Date().toISOString() }
    MEMORY_STORE[index] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    const index = MEMORY_STORE.findIndex((item) => item.id === id)
    if (index === -1) throw new Error(`套餐不存在: ${id}`)
    if (id === "1") throw new Error("基础套餐不能删除")
    MEMORY_STORE.splice(index, 1)
  },
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)]
}

async function findListFromDb(params: { page: number; pageSize: number; keyword?: string }): Promise<PageResult<TenantPackageRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_tenant_package").where("deleted", "=", false)
  if (params.keyword) query = query.where("name", "like", `%${params.keyword}%`)
  const total = Number((await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst())?.count ?? 0)
  const rows = await query.selectAll().orderBy("created_at", "desc").offset((params.page - 1) * params.pageSize).limit(params.pageSize).execute()
  return { items: await mapRows(rows), total, page: params.page, pageSize: params.pageSize }
}

async function findAllFromDb(): Promise<TenantPackageRow[]> {
  const db = await getKyselyDb()
  return mapRows(await db.selectFrom("system_tenant_package").selectAll().where("deleted", "=", false).orderBy("created_at", "desc").execute())
}

async function findByIdFromDb(id: string): Promise<TenantPackageRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_tenant_package").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
  return row ? mapRow(row, await menuIdsByPackageIds([id])) : null
}

async function createInDb(data: CreateTenantPackageData): Promise<TenantPackageRow> {
  const db = await getKyselyDb()
  const now = new Date()
  return db.transaction().execute(async (trx) => {
    const row = await trx.insertInto("system_tenant_package").values({ id: randomUUID(), name: data.name, status: data.status ?? "ACTIVE", remark: data.remark ?? null, created_at: now, updated_at: now, deleted: false }).returningAll().executeTakeFirstOrThrow()
    await replaceMenuIds(trx, row.id, data.menuIds ?? [])
    return mapRow(row, new Map([[row.id, uniqueIds(data.menuIds ?? [])]]))
  })
}

async function updateInDb(id: string, data: UpdateTenantPackageData): Promise<TenantPackageRow> {
  const db = await getKyselyDb()
  return db.transaction().execute(async (trx) => {
    const updates: Record<string, unknown> = { updated_at: new Date() }
    if (data.name !== undefined) updates.name = data.name
    if (data.status !== undefined) updates.status = data.status
    if (data.remark !== undefined) updates.remark = data.remark ?? null
    const row = await trx.updateTable("system_tenant_package").set(updates as any).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirst()
    if (!row) throw new Error(`套餐不存在: ${id}`)
    if (data.menuIds !== undefined) await replaceMenuIds(trx, id, data.menuIds)
    const menuIds = data.menuIds === undefined ? await menuIdsByPackageIds([id], trx) : new Map([[id, uniqueIds(data.menuIds)]])
    return mapRow(row, menuIds)
  })
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  const assigned = await db.selectFrom("system_tenant").select((eb) => eb.fn.countAll<number>().as("count")).where("package_id", "=", id).where("deleted", "=", false).executeTakeFirst()
  if (Number(assigned?.count ?? 0) > 0) throw new Error("套餐已分配给租户，不能删除")
  const result = await db.updateTable("system_tenant_package").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
  if (Number(result.numUpdatedRows) === 0) throw new Error(`套餐不存在: ${id}`)
}

async function replaceMenuIds(trx: Awaited<ReturnType<typeof getKyselyDb>>, packageId: string, menuIds: string[]): Promise<void> {
  await trx.deleteFrom("system_tenant_package_menu").where("package_id", "=", packageId).execute()
  const ids = uniqueIds(menuIds)
  if (ids.length) await trx.insertInto("system_tenant_package_menu").values(ids.map((menuId) => ({ id: randomUUID(), package_id: packageId, menu_id: menuId }))).execute()
}

async function menuIdsByPackageIds(packageIds: string[], database?: Awaited<ReturnType<typeof getKyselyDb>>): Promise<Map<string, string[]>> {
  const db = database ?? await getKyselyDb()
  const result = new Map(packageIds.map((id) => [id, [] as string[]]))
  if (!packageIds.length) return result
  const rows = await db.selectFrom("system_tenant_package_menu").select(["package_id", "menu_id"]).where("package_id", "in", packageIds).execute()
  for (const row of rows) result.get(row.package_id)?.push(row.menu_id)
  return result
}

async function mapRows(rows: any[]): Promise<TenantPackageRow[]> {
  const menuIds = await menuIdsByPackageIds(rows.map((row) => row.id))
  return rows.map((row) => mapRow(row, menuIds))
}

function mapRow(row: any, menuIds: Map<string, string[]>): TenantPackageRow {
  return { id: row.id, name: row.name, status: row.status, menuIds: menuIds.get(row.id) ?? [], remark: row.remark, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at), updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at) }
}

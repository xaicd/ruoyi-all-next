/**
 * SystemPost Repository
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"
import { SEED_POSTS } from "@/modules/shared/backend/seed-data"

export type SystemPostRow = {
  id: string
  name: string
  code: string
  sort: number
  status: string
  remark: string | null
  createdAt: string
  updatedAt: string
}

export type CreatePostData = { name: string; code: string; sort?: number; status?: string; remark?: string }
export type UpdatePostData = Partial<CreatePostData>
export type PostListParams = { page: number; pageSize: number; keyword?: string; status?: string }

const MEMORY_STORE: SystemPostRow[] = [...SEED_POSTS]
let memoryIdSeq = 100

export const SystemPostRepository = {
  async findList(params: PostListParams): Promise<PageResult<SystemPostRow>> {
    if (hasRealDatabase()) return findListFromDb(params)
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((p) => p.name.toLowerCase().includes(kw) || p.code.toLowerCase().includes(kw)) }
    if (params.status) filtered = filtered.filter((p) => p.status === params.status)
    filtered.sort((a, b) => a.sort - b.sort)
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<SystemPostRow | null> {
    if (hasRealDatabase()) return findByIdFromDb(id)
    return MEMORY_STORE.find((p) => p.id === id) ?? null
  },

  async findByCode(code: string): Promise<SystemPostRow | null> {
    if (hasRealDatabase()) return findByCodeFromDb(code)
    return MEMORY_STORE.find((p) => p.code === code) ?? null
  },

  async create(data: CreatePostData): Promise<SystemPostRow> {
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString()
    const row: SystemPostRow = { id: String(++memoryIdSeq), name: data.name, code: data.code, sort: data.sort ?? 0, status: data.status ?? "ACTIVE", remark: data.remark ?? null, createdAt: now, updatedAt: now }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdatePostData): Promise<SystemPostRow> {
    if (hasRealDatabase()) return updateInDb(id, data)
    const idx = MEMORY_STORE.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error(`岗位不存在: ${id}`)
    const post = MEMORY_STORE[idx]
    const updated: SystemPostRow = { ...post, name: data.name ?? post.name, code: data.code ?? post.code, sort: data.sort ?? post.sort, status: data.status ?? post.status, remark: data.remark !== undefined ? (data.remark ?? null) : post.remark, updatedAt: new Date().toISOString() }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    const idx = MEMORY_STORE.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error(`岗位不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}

// === Kysely ===
async function findListFromDb(params: PostListParams): Promise<PageResult<SystemPostRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_post").where("deleted", "=", false)
  if (params.keyword) { const kw = `%${params.keyword}%`; query = query.where((eb) => eb.or([eb("name", "like", kw), eb("code", "like", kw)])) }
  if (params.status) query = query.where("status", "=", params.status)
  const countResult = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  const total = Number(countResult?.count ?? 0)
  const offset = (params.page - 1) * params.pageSize
  const rows = await query.selectAll().orderBy("sort", "asc").offset(offset).limit(params.pageSize).execute()
  return { items: rows.map(mapDbRow), total, page: params.page, pageSize: params.pageSize }
}

async function findByIdFromDb(id: string): Promise<SystemPostRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_post").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function findByCodeFromDb(code: string): Promise<SystemPostRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_post").selectAll().where("code", "=", code).where("deleted", "=", false).executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function createInDb(data: CreatePostData): Promise<SystemPostRow> {
  const db = await getKyselyDb()
  const row = await db.insertInto("system_post").values({ name: data.name, code: data.code, sort: data.sort ?? 0, status: data.status ?? "ACTIVE", remark: data.remark ?? null, tenant_id: null, updated_at: new Date(), deleted: false }).returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function updateInDb(id: string, data: UpdatePostData): Promise<SystemPostRow> {
  const db = await getKyselyDb()
  const updateData: Record<string, any> = { updated_at: new Date() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.code !== undefined) updateData.code = data.code
  if (data.sort !== undefined) updateData.sort = data.sort
  if (data.status !== undefined) updateData.status = data.status
  if (data.remark !== undefined) updateData.remark = data.remark
  const row = await db.updateTable("system_post").set(updateData).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  await db.updateTable("system_post").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).execute()
}

function mapDbRow(row: any): SystemPostRow {
  return { id: row.id, name: row.name, code: row.code, sort: row.sort, status: row.status, remark: row.remark, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at), updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at) }
}

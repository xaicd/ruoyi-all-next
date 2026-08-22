import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type SystemAreaRow = {
  id: string
  name: string
  parentId: string | null
  level: number
  status: string
  createdAt: string
}

const MEMORY_STORE: SystemAreaRow[] = [
  { id: "1", name: "中国", parentId: null, level: 1, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "广东省", parentId: "1", level: 2, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "3", name: "深圳市", parentId: "2", level: 3, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "4", name: "北京市", parentId: "1", level: 2, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]

function mapRow(row: { id: string; name: string; parent_id: string | null; level: number; status: string; created_at: Date | string }): SystemAreaRow {
  return { id: row.id, name: row.name, parentId: row.parent_id, level: row.level, status: row.status, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at) }
}

export const SystemAreaRepository = {
  async page(params: { page: number; pageSize: number; keyword?: string }): Promise<PageResult<SystemAreaRow>> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db.selectFrom("system_area").where("deleted", "=", false)
      if (params.keyword) query = query.where("name", "like", `%${params.keyword}%`)
      const total = Number((await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst())?.count ?? 0)
      const rows = await query.selectAll().orderBy("level", "asc").offset((params.page - 1) * params.pageSize).limit(params.pageSize).execute()
      return { items: rows.map(mapRow), total, page: params.page, pageSize: params.pageSize }
    }
    const filtered = MEMORY_STORE.filter((row) => !params.keyword || row.name.toLowerCase().includes(params.keyword.toLowerCase()))
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total: filtered.length, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<SystemAreaRow | null> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.selectFrom("system_area").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
      return row ? mapRow(row) : null
    }
    return MEMORY_STORE.find((row) => row.id === id) ?? null
  },

  async create(data: { name: string; parentId?: string; level?: number }): Promise<SystemAreaRow> {
    const now = new Date()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.insertInto("system_area").values({
        id: randomUUID(), name: data.name, parent_id: data.parentId ?? null, level: data.level ?? 1, status: "ACTIVE", created_at: now, updated_at: now, deleted: false,
      }).returningAll().executeTakeFirstOrThrow()
      return mapRow(row)
    }
    const row: SystemAreaRow = { id: randomUUID(), name: data.name, parentId: data.parentId ?? null, level: data.level ?? 1, status: "ACTIVE", createdAt: now.toISOString() }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: { name?: string; parentId?: string | null; level?: number; status?: string }): Promise<SystemAreaRow> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const patch: Record<string, unknown> = { updated_at: new Date() }
      if (data.name !== undefined) patch.name = data.name
      if (data.parentId !== undefined) patch.parent_id = data.parentId
      if (data.level !== undefined) patch.level = data.level
      if (data.status !== undefined) patch.status = data.status
      const row = await db.updateTable("system_area").set(patch).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirst()
      if (!row) throw new Error("地区不存在")
      return mapRow(row)
    }
    const idx = MEMORY_STORE.findIndex((row) => row.id === id)
    if (idx < 0) throw new Error("地区不存在")
    MEMORY_STORE[idx] = { ...MEMORY_STORE[idx], name: data.name ?? MEMORY_STORE[idx].name, parentId: data.parentId !== undefined ? data.parentId : MEMORY_STORE[idx].parentId, level: data.level ?? MEMORY_STORE[idx].level, status: data.status ?? MEMORY_STORE[idx].status }
    return MEMORY_STORE[idx]
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const result = await db.updateTable("system_area").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
      if (!Number(result.numUpdatedRows ?? 0)) throw new Error("地区不存在")
      return
    }
    const idx = MEMORY_STORE.findIndex((row) => row.id === id)
    if (idx < 0) throw new Error("地区不存在")
    MEMORY_STORE.splice(idx, 1)
  },
}

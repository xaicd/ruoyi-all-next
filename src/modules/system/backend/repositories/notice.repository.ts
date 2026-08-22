import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type SystemNoticeRow = {
  id: string
  title: string
  content: string
  type: string
  status: string
  createdAt: string
  updatedAt: string
}

const MEMORY_STORE: SystemNoticeRow[] = [
  { id: "1", title: "系统维护通知", content: "系统将于2026年8月10日凌晨2:00-4:00进行维护升级", type: "INFO", status: "ACTIVE", createdAt: "2026-08-05T10:00:00.000Z", updatedAt: "2026-08-05T10:00:00.000Z" },
  { id: "2", title: "新功能上线公告", content: "代码生成器低代码引擎已上线，欢迎体验", type: "WARN", status: "ACTIVE", createdAt: "2026-08-01T09:00:00.000Z", updatedAt: "2026-08-01T09:00:00.000Z" },
]

function iso(value: Date | string) {
  return value instanceof Date ? value.toISOString() : String(value)
}

function mapRow(row: { id: string; title: string; content: string; type: string; status: string; created_at: Date | string; updated_at: Date | string }): SystemNoticeRow {
  return { id: row.id, title: row.title, content: row.content, type: row.type, status: row.status, createdAt: iso(row.created_at), updatedAt: iso(row.updated_at) }
}

export const SystemNoticeRepository = {
  async page(params: { page: number; pageSize: number; keyword?: string }): Promise<PageResult<SystemNoticeRow>> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db.selectFrom("system_notice").where("deleted", "=", false)
      if (params.keyword) query = query.where("title", "like", `%${params.keyword}%`)
      const total = Number((await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst())?.count ?? 0)
      const rows = await query.selectAll().orderBy("created_at", "desc").offset((params.page - 1) * params.pageSize).limit(params.pageSize).execute()
      return { items: rows.map(mapRow), total, page: params.page, pageSize: params.pageSize }
    }
    let filtered = MEMORY_STORE.filter((row) => !params.keyword || row.title.toLowerCase().includes(params.keyword.toLowerCase()))
    filtered = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total: filtered.length, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<SystemNoticeRow | null> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.selectFrom("system_notice").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
      return row ? mapRow(row) : null
    }
    return MEMORY_STORE.find((row) => row.id === id) ?? null
  },

  async create(data: { title: string; content: string; type?: string }): Promise<SystemNoticeRow> {
    const now = new Date()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.insertInto("system_notice").values({
        id: randomUUID(), title: data.title, content: data.content, type: data.type ?? "INFO", status: "ACTIVE", created_at: now, updated_at: now, deleted: false,
      }).returningAll().executeTakeFirstOrThrow()
      return mapRow(row)
    }
    const row: SystemNoticeRow = { id: randomUUID(), title: data.title, content: data.content, type: data.type ?? "INFO", status: "ACTIVE", createdAt: now.toISOString(), updatedAt: now.toISOString() }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: { title?: string; content?: string; type?: string; status?: string }): Promise<SystemNoticeRow> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const patch: Record<string, unknown> = { updated_at: new Date() }
      if (data.title !== undefined) patch.title = data.title
      if (data.content !== undefined) patch.content = data.content
      if (data.type !== undefined) patch.type = data.type
      if (data.status !== undefined) patch.status = data.status
      const row = await db.updateTable("system_notice").set(patch).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirst()
      if (!row) throw new Error("通知不存在")
      return mapRow(row)
    }
    const idx = MEMORY_STORE.findIndex((row) => row.id === id)
    if (idx < 0) throw new Error("通知不存在")
    MEMORY_STORE[idx] = { ...MEMORY_STORE[idx], ...data, updatedAt: new Date().toISOString() }
    return MEMORY_STORE[idx]
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const result = await db.updateTable("system_notice").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
      if (!Number(result.numUpdatedRows ?? 0)) throw new Error("通知不存在")
      return
    }
    const idx = MEMORY_STORE.findIndex((row) => row.id === id)
    if (idx < 0) throw new Error("通知不存在")
    MEMORY_STORE.splice(idx, 1)
  },
}

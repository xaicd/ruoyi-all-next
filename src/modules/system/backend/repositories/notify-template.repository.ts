import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type SystemNotifyTemplateRow = {
  id: string
  code: string
  name: string
  channel: string
  content: string
  params: string[]
  status: string
  createdAt: string
}

const MEMORY_STORE: SystemNotifyTemplateRow[] = [
  { id: "1", code: "user_register", name: "用户注册通知", channel: "SMS", content: "尊敬的{name}，您已成功注册", params: ["name"], status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", code: "order_paid", name: "订单支付通知", channel: "SITE", content: "订单{orderNo}已支付成功", params: ["orderNo"], status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]

function parseParams(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : []
  } catch {
    return []
  }
}

function mapRow(row: { id: string; code: string; name: string; channel: string; content: string; params: string; status: string; created_at: Date | string }): SystemNotifyTemplateRow {
  return { id: row.id, code: row.code, name: row.name, channel: row.channel, content: row.content, params: parseParams(row.params), status: row.status, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at) }
}

export const SystemNotifyTemplateRepository = {
  async page(params: { page: number; pageSize: number; keyword?: string }): Promise<PageResult<SystemNotifyTemplateRow>> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db.selectFrom("system_notify_template").where("deleted", "=", false)
      if (params.keyword) {
        const kw = `%${params.keyword}%`
        query = query.where((eb) => eb.or([eb("name", "like", kw), eb("code", "like", kw)]))
      }
      const total = Number((await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst())?.count ?? 0)
      const rows = await query.selectAll().orderBy("created_at", "desc").offset((params.page - 1) * params.pageSize).limit(params.pageSize).execute()
      return { items: rows.map(mapRow), total, page: params.page, pageSize: params.pageSize }
    }
    const filtered = MEMORY_STORE.filter((row) => !params.keyword || row.name.toLowerCase().includes(params.keyword.toLowerCase()) || row.code.toLowerCase().includes(params.keyword.toLowerCase()))
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total: filtered.length, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<SystemNotifyTemplateRow | null> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.selectFrom("system_notify_template").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
      return row ? mapRow(row) : null
    }
    return MEMORY_STORE.find((row) => row.id === id) ?? null
  },

  async findByCode(code: string): Promise<SystemNotifyTemplateRow | null> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.selectFrom("system_notify_template").selectAll().where("code", "=", code).where("deleted", "=", false).executeTakeFirst()
      return row ? mapRow(row) : null
    }
    return MEMORY_STORE.find((row) => row.code === code) ?? null
  },

  async create(data: { code: string; name: string; channel?: string; content?: string; params?: string[] }): Promise<SystemNotifyTemplateRow> {
    const now = new Date()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.insertInto("system_notify_template").values({
        id: randomUUID(), code: data.code, name: data.name, channel: data.channel ?? "SITE", content: data.content ?? "", params: JSON.stringify(data.params ?? []), status: "ACTIVE", created_at: now, updated_at: now, deleted: false,
      }).returningAll().executeTakeFirstOrThrow()
      return mapRow(row)
    }
    const row: SystemNotifyTemplateRow = { id: randomUUID(), code: data.code, name: data.name, channel: data.channel ?? "SITE", content: data.content ?? "", params: data.params ?? [], status: "ACTIVE", createdAt: now.toISOString() }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: Partial<Omit<SystemNotifyTemplateRow, "id" | "createdAt">>): Promise<SystemNotifyTemplateRow> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const patch: Record<string, unknown> = { updated_at: new Date() }
      if (data.code !== undefined) patch.code = data.code
      if (data.name !== undefined) patch.name = data.name
      if (data.channel !== undefined) patch.channel = data.channel
      if (data.content !== undefined) patch.content = data.content
      if (data.params !== undefined) patch.params = JSON.stringify(data.params)
      if (data.status !== undefined) patch.status = data.status
      const row = await db.updateTable("system_notify_template").set(patch).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirst()
      if (!row) throw new Error("通知模板不存在")
      return mapRow(row)
    }
    const idx = MEMORY_STORE.findIndex((row) => row.id === id)
    if (idx < 0) throw new Error("通知模板不存在")
    MEMORY_STORE[idx] = { ...MEMORY_STORE[idx], ...data }
    return MEMORY_STORE[idx]
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const result = await db.updateTable("system_notify_template").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
      if (!Number(result.numUpdatedRows ?? 0)) throw new Error("通知模板不存在")
      return
    }
    const idx = MEMORY_STORE.findIndex((row) => row.id === id)
    if (idx < 0) throw new Error("通知模板不存在")
    MEMORY_STORE.splice(idx, 1)
  },
}

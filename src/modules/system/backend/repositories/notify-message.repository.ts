import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type SystemNotifyMessageRow = {
  id: string
  templateCode: string
  templateName: string
  channel: string
  receiver: string
  content: string
  readStatus: boolean
  createdAt: string
}

const MEMORY_STORE: SystemNotifyMessageRow[] = [
  { id: "1", templateCode: "user_register", templateName: "用户注册通知", channel: "SMS", receiver: "13800000001", content: "尊敬的admin，您已成功注册", readStatus: true, createdAt: "2026-01-15T10:00:00.000Z" },
  { id: "2", templateCode: "order_paid", templateName: "订单支付通知", channel: "SITE", receiver: "admin", content: "订单ORD001已支付成功", readStatus: false, createdAt: "2026-08-06T14:00:00.000Z" },
]

function mapRow(row: { id: string; template_code: string; template_name: string; channel: string; receiver: string; content: string; read_status: boolean; created_at: Date | string }): SystemNotifyMessageRow {
  return { id: row.id, templateCode: row.template_code, templateName: row.template_name, channel: row.channel, receiver: row.receiver, content: row.content, readStatus: row.read_status, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at) }
}

export const SystemNotifyMessageRepository = {
  async page(params: { page: number; pageSize: number; keyword?: string }): Promise<PageResult<SystemNotifyMessageRow>> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db.selectFrom("system_notify_message").where("deleted", "=", false)
      if (params.keyword) {
        const kw = `%${params.keyword}%`
        query = query.where((eb) => eb.or([eb("content", "like", kw), eb("template_name", "like", kw)]))
      }
      const total = Number((await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst())?.count ?? 0)
      const rows = await query.selectAll().orderBy("created_at", "desc").offset((params.page - 1) * params.pageSize).limit(params.pageSize).execute()
      return { items: rows.map(mapRow), total, page: params.page, pageSize: params.pageSize }
    }
    const filtered = [...MEMORY_STORE]
      .filter((row) => !params.keyword || row.content.toLowerCase().includes(params.keyword.toLowerCase()) || row.templateName.toLowerCase().includes(params.keyword.toLowerCase()))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total: filtered.length, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<SystemNotifyMessageRow | null> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.selectFrom("system_notify_message").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
      return row ? mapRow(row) : null
    }
    return MEMORY_STORE.find((row) => row.id === id) ?? null
  },

  async create(data: { templateCode: string; templateName: string; channel?: string; receiver: string; content?: string }): Promise<SystemNotifyMessageRow> {
    const now = new Date()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.insertInto("system_notify_message").values({
        id: randomUUID(), template_code: data.templateCode, template_name: data.templateName, channel: data.channel ?? "SITE", receiver: data.receiver, content: data.content ?? "", read_status: false, created_at: now, deleted: false,
      }).returningAll().executeTakeFirstOrThrow()
      return mapRow(row)
    }
    const row: SystemNotifyMessageRow = { id: randomUUID(), templateCode: data.templateCode, templateName: data.templateName, channel: data.channel ?? "SITE", receiver: data.receiver, content: data.content ?? "", readStatus: false, createdAt: now.toISOString() }
    MEMORY_STORE.push(row)
    return row
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const result = await db.updateTable("system_notify_message").set({ deleted: true }).where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
      if (!Number(result.numUpdatedRows ?? 0)) throw new Error("通知消息不存在")
      return
    }
    const idx = MEMORY_STORE.findIndex((row) => row.id === id)
    if (idx < 0) throw new Error("通知消息不存在")
    MEMORY_STORE.splice(idx, 1)
  },
}

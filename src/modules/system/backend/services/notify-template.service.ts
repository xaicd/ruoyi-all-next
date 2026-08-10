import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type NotifyTemplateItem = { id: string; code: string; name: string; channel: string; content: string; params: string[]; status: string; createdAt: string }

const MOCK_DATA: NotifyTemplateItem[] = [
  { id: "1", code: "user_register", name: "用户注册通知", channel: "SMS", content: "尊敬的{name}，您已成功注册", params: ["name"], status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", code: "order_paid", name: "订单支付通知", channel: "SITE", content: "订单{orderNo}已支付成功", params: ["orderNo"], status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class NotifyTemplateService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((t) => t.name.toLowerCase().includes(kw) || t.code.toLowerCase().includes(kw)) }
    domainLog.event("system.notifyTemplate.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((t) => t.id === id) ?? null }
  static async create(input: any) { const row: NotifyTemplateItem = { id: String(++nextId), code: input.code, name: input.name, channel: input.channel ?? "SITE", content: input.content ?? "", params: input.params ?? [], status: "ACTIVE", createdAt: new Date().toISOString() }; MOCK_DATA.push(row); domainLog.event("system.notifyTemplate.create", { id: row.id }); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((t) => t.id === input.id); if (idx === -1) throw new Error("通知模板不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((t) => t.id === id); if (idx === -1) throw new Error("通知模板不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

// Alias for index.ts re-export
export {  as  }

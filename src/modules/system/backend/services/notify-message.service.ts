import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type NotifyMessageItem = { id: string; templateCode: string; templateName: string; channel: string; receiver: string; content: string; readStatus: boolean; createdAt: string }

const MOCK_DATA: NotifyMessageItem[] = [
  { id: "1", templateCode: "user_register", templateName: "用户注册通知", channel: "SMS", receiver: "13800000001", content: "尊敬的admin，您已成功注册", readStatus: true, createdAt: "2026-01-15T10:00:00.000Z" },
  { id: "2", templateCode: "order_paid", templateName: "订单支付通知", channel: "SITE", receiver: "admin", content: "订单ORD001已支付成功", readStatus: false, createdAt: "2026-08-06T14:00:00.000Z" },
]

export class NotifyMessageService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((m) => m.content.toLowerCase().includes(kw) || m.templateName.toLowerCase().includes(kw)) }
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    domainLog.event("system.notifyMessage.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((m) => m.id === id) ?? null }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((m) => m.id === id); if (idx !== -1) MOCK_DATA.splice(idx, 1); return { success: true } }
}

// Alias for index.ts re-export
export {  as  }

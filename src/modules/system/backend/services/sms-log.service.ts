import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type SmsLogItem = { id: string; channelId: string; channelCode: string; templateCode: string; phone: string; content: string; sendStatus: string; createdAt: string }

const MOCK_DATA: SmsLogItem[] = [
  { id: "1", channelId: "1", channelCode: "ALIYUN", templateCode: "user_register", phone: "13800000001", content: "您的验证码是123456", sendStatus: "SUCCESS", createdAt: "2026-08-07T10:00:00.000Z" },
  { id: "2", channelId: "1", channelCode: "ALIYUN", templateCode: "order_paid", phone: "13900000001", content: "订单已支付", sendStatus: "FAIL", createdAt: "2026-08-06T15:00:00.000Z" },
]

export class SmsLogService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((l) => l.phone.includes(kw) || l.content.toLowerCase().includes(kw)) }
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    domainLog.event("system.smsLog.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((l) => l.id === id) ?? null }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((l) => l.id === id); if (idx !== -1) MOCK_DATA.splice(idx, 1); return { success: true } }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}

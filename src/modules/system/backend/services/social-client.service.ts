import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type SocialClientItem = { id: string; name: string; socialType: string; clientId: string; clientSecret: string; status: string; createdAt: string }

const MOCK_DATA: SocialClientItem[] = [
  { id: "1", name: "微信公众号", socialType: "WECHAT_MP", clientId: "wx_abc123", clientSecret: "***", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "微信小程序", socialType: "WECHAT_MINI", clientId: "wx_mini456", clientSecret: "***", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class SocialClientService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((c) => c.name.toLowerCase().includes(kw) || c.socialType.toLowerCase().includes(kw)) }
    domainLog.event("system.socialClient.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((c) => c.id === id) ?? null }
  static async create(input: any) { const row: SocialClientItem = { id: String(++nextId), name: input.name, socialType: input.socialType, clientId: input.clientId ?? "", clientSecret: input.clientSecret ?? "", status: "ACTIVE", createdAt: new Date().toISOString() }; MOCK_DATA.push(row); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((c) => c.id === input.id); if (idx === -1) throw new Error("社交客户端不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((c) => c.id === id); if (idx === -1) throw new Error("社交客户端不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

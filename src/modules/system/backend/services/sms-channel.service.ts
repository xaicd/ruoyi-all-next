import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type SmsChannelItem = { id: string; name: string; code: string; signName: string; status: string; remark: string | null; createdAt: string }

const MOCK_DATA: SmsChannelItem[] = [
  { id: "1", name: "阿里云短信", code: "ALIYUN", signName: "若依科技", status: "ACTIVE", remark: null, createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "腾讯云短信", code: "TENCENT", signName: "若依科技", status: "DISABLED", remark: "备用渠道", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class SmsChannelService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((c) => c.name.toLowerCase().includes(kw) || c.code.toLowerCase().includes(kw)) }
    domainLog.event("system.smsChannel.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((c) => c.id === id) ?? null }
  static async create(input: any) { const row: SmsChannelItem = { id: String(++nextId), name: input.name, code: input.code ?? "", signName: input.signName ?? "", status: input.status ?? "ACTIVE", remark: input.remark ?? null, createdAt: new Date().toISOString() }; MOCK_DATA.push(row); domainLog.event("system.smsChannel.create", { id: row.id }); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((c) => c.id === input.id); if (idx === -1) throw new Error("短信渠道不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((c) => c.id === id); if (idx === -1) throw new Error("短信渠道不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

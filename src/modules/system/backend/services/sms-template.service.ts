import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type SmsTemplateItem = { id: string; channelId: string; code: string; name: string; content: string; apiTemplateId: string; status: string; createdAt: string }

const MOCK_DATA: SmsTemplateItem[] = [
  { id: "1", channelId: "1", code: "verify_code", name: "验证码", content: "您的验证码是{code}，有效期5分钟", apiTemplateId: "SMS_001", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class SmsTemplateService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((t) => t.name.toLowerCase().includes(kw) || t.code.toLowerCase().includes(kw)) }
    domainLog.event("system.smsTemplate.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((t) => t.id === id) ?? null }
  static async create(input: any) { const row: SmsTemplateItem = { id: String(++nextId), channelId: input.channelId ?? "1", code: input.code, name: input.name, content: input.content ?? "", apiTemplateId: input.apiTemplateId ?? "", status: "ACTIVE", createdAt: new Date().toISOString() }; MOCK_DATA.push(row); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((t) => t.id === input.id); if (idx === -1) throw new Error("短信模板不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((t) => t.id === id); if (idx === -1) throw new Error("短信模板不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

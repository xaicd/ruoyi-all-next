import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type MailTemplateItem = { id: string; code: string; name: string; title: string; content: string; accountId: string; status: string; createdAt: string }

const MOCK_DATA: MailTemplateItem[] = [
  { id: "1", code: "welcome", name: "欢迎邮件", title: "欢迎注册{appName}", content: "<p>尊敬的{name}，欢迎使用我们的平台</p>", accountId: "1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class MailTemplateService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((t) => t.name.toLowerCase().includes(kw) || t.code.toLowerCase().includes(kw)) }
    domainLog.event("system.mailTemplate.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((t) => t.id === id) ?? null }
  static async create(input: any) { const row: MailTemplateItem = { id: String(++nextId), code: input.code, name: input.name, title: input.title ?? "", content: input.content ?? "", accountId: input.accountId ?? "1", status: "ACTIVE", createdAt: new Date().toISOString() }; MOCK_DATA.push(row); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((t) => t.id === input.id); if (idx === -1) throw new Error("邮件模板不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((t) => t.id === id); if (idx === -1) throw new Error("邮件模板不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

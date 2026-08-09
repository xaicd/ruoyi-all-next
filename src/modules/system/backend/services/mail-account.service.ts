import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type MailAccountItem = { id: string; email: string; host: string; port: number; username: string; sslEnable: boolean; status: string; createdAt: string }

const MOCK_DATA: MailAccountItem[] = [
  { id: "1", email: "noreply@ruoyi.local", host: "smtp.ruoyi.local", port: 465, username: "noreply", sslEnable: true, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class MailAccountService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((a) => a.email.toLowerCase().includes(kw)) }
    domainLog.event("system.mailAccount.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((a) => a.id === id) ?? null }
  static async create(input: any) { const row: MailAccountItem = { id: String(++nextId), email: input.email, host: input.host ?? "", port: input.port ?? 465, username: input.username ?? "", sslEnable: input.sslEnable ?? true, status: input.status ?? "ACTIVE", createdAt: new Date().toISOString() }; MOCK_DATA.push(row); domainLog.event("system.mailAccount.create", { id: row.id }); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((a) => a.id === input.id); if (idx === -1) throw new Error("邮箱账号不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((a) => a.id === id); if (idx === -1) throw new Error("邮箱账号不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

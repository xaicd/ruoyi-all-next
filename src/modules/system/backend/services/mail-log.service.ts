import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type MailLogItem = { id: string; accountId: string; toEmail: string; subject: string; sendStatus: string; createdAt: string }

const MOCK_DATA: MailLogItem[] = [
  { id: "1", accountId: "1", toEmail: "user@example.com", subject: "欢迎注册", sendStatus: "SUCCESS", createdAt: "2026-08-05T10:00:00.000Z" },
]

export class MailLogService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((l) => l.toEmail.toLowerCase().includes(kw) || l.subject.toLowerCase().includes(kw)) }
    domainLog.event("system.mailLog.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((l) => l.id === id) ?? null }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((l) => l.id === id); if (idx !== -1) MOCK_DATA.splice(idx, 1); return { success: true } }
}

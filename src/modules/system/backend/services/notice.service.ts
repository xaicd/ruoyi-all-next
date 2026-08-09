import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type NoticeItem = { id: string; title: string; content: string; type: string; status: string; createdAt: string }

const MOCK_DATA: NoticeItem[] = [
  { id: "1", title: "系统维护通知", content: "系统将于2026年8月10日凌晨2:00-4:00进行维护升级", type: "INFO", status: "ACTIVE", createdAt: "2026-08-05T10:00:00.000Z" },
  { id: "2", title: "新功能上线公告", content: "代码生成器低代码引擎已上线，欢迎体验", type: "WARN", status: "ACTIVE", createdAt: "2026-08-01T09:00:00.000Z" },
]
let nextId = 100

export class NoticeService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((n) => n.title.toLowerCase().includes(kw)) }
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const total = filtered.length
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.notice.page", { total })
    return { items: filtered.slice(start, start + input.pageSize), total, page: input.page, pageSize: input.pageSize }
  }

  static async get(id: string) {
    const item = MOCK_DATA.find((n) => n.id === id)
    if (!item) throw new Error("通知不存在")
    return item
  }

  static async create(input: any) {
    const row: NoticeItem = { id: String(++nextId), title: input.title, content: input.content, type: input.type ?? "INFO", status: "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(row)
    domainLog.event("system.notice.create", { id: row.id })
    domainLog.audit("system.notice.create", { targetType: "NOTICE", targetId: row.id })
    return { id: row.id }
  }

  static async update(input: any) {
    const idx = MOCK_DATA.findIndex((n) => n.id === input.id)
    if (idx === -1) throw new Error("通知不存在")
    MOCK_DATA[idx] = { ...MOCK_DATA[idx], title: input.title ?? MOCK_DATA[idx].title, content: input.content ?? MOCK_DATA[idx].content, type: input.type ?? MOCK_DATA[idx].type, status: input.status ?? MOCK_DATA[idx].status }
    domainLog.event("system.notice.update", { id: input.id })
    return { id: input.id }
  }

  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((n) => n.id === id)
    if (idx === -1) throw new Error("通知不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("system.notice.delete", { id })
    return { success: true }
  }
}

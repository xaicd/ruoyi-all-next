import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type ApiErrorLogItem = { id: string; userId: string | null; requestMethod: string; requestUrl: string; exceptionName: string; exceptionMessage: string; status: string; userIp: string; createdAt: string }

const MOCK_DATA: ApiErrorLogItem[] = [
  { id: "1", userId: "1", requestMethod: "POST", requestUrl: "/api/v1/admin/system/users", exceptionName: "ZodError", exceptionMessage: "用户名不能为空", status: "UNPROCESSED", userIp: "127.0.0.1", createdAt: "2026-08-07T11:00:00.000Z" },
]

export class ApiErrorLogService {
  static async page(input: { page: number; pageSize: number; keyword?: string; status?: string }) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((l) => l.exceptionMessage.toLowerCase().includes(kw) || l.requestUrl.toLowerCase().includes(kw)) }
    if (input.status) filtered = filtered.filter((l) => l.status === input.status)
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    domainLog.event("infra.apiErrorLog.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((l) => l.id === id) ?? null }
  static async markProcessed(id: string) { const item = MOCK_DATA.find((l) => l.id === id); if (item) item.status = "PROCESSED"; return { success: true } }
  static async create(input: any) { return { id: "mock" } }
  static async update(input: any) { return ApiErrorLogService.markProcessed(input.id) }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((l) => l.id === id); if (idx !== -1) MOCK_DATA.splice(idx, 1); return { success: true } }
}

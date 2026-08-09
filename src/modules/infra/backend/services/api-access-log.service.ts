import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type ApiAccessLogItem = { id: string; userId: string | null; requestMethod: string; requestUrl: string; duration: number; resultCode: number; userIp: string; createdAt: string }

const MOCK_DATA: ApiAccessLogItem[] = [
  { id: "1", userId: "1", requestMethod: "GET", requestUrl: "/api/v1/admin/system/users", duration: 23, resultCode: 200, userIp: "127.0.0.1", createdAt: "2026-08-07T10:30:00.000Z" },
  { id: "2", userId: "1", requestMethod: "POST", requestUrl: "/api/v1/admin/system/users", duration: 45, resultCode: 201, userIp: "127.0.0.1", createdAt: "2026-08-07T10:31:00.000Z" },
  { id: "3", userId: "2", requestMethod: "GET", requestUrl: "/api/v1/admin/infra/configs", duration: 12, resultCode: 200, userIp: "192.168.1.100", createdAt: "2026-08-06T14:00:00.000Z" },
]

export class ApiAccessLogService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((l) => l.requestUrl.toLowerCase().includes(kw) || l.requestMethod.toLowerCase().includes(kw)) }
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    domainLog.event("infra.apiAccessLog.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((l) => l.id === id) ?? null }
  static async create(input: any) { return { id: "mock" } }
  static async update(input: any) { return { id: input.id ?? "mock" } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((l) => l.id === id); if (idx !== -1) MOCK_DATA.splice(idx, 1); return { success: true } }
}

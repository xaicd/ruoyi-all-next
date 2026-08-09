import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type LoginLogItem = { id: string; userId: string; username: string; userIp: string; result: string; remark: string | null; createdAt: string }

const MOCK_DATA: LoginLogItem[] = [
  { id: "1", userId: "1", username: "admin", userIp: "127.0.0.1", result: "SUCCESS", remark: null, createdAt: "2026-08-07T10:00:00.000Z" },
  { id: "2", userId: "2", username: "test", userIp: "192.168.1.100", result: "SUCCESS", remark: null, createdAt: "2026-08-07T09:30:00.000Z" },
  { id: "3", userId: "1", username: "admin", userIp: "10.0.0.1", result: "FAIL", remark: "密码错误", createdAt: "2026-08-06T18:00:00.000Z" },
]

export class LoginLogService {
  static async page(input: { page: number; pageSize: number; keyword?: string; result?: string }) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((l) => l.username.toLowerCase().includes(kw) || l.userIp.includes(kw)) }
    if (input.result) filtered = filtered.filter((l) => l.result === input.result)
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const total = filtered.length
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.loginLog.page", { total })
    return { items: filtered.slice(start, start + input.pageSize), total, page: input.page, pageSize: input.pageSize }
  }

  static async get(id: string) {
    return MOCK_DATA.find((l) => l.id === id) ?? null
  }

  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((l) => l.id === id)
    if (idx !== -1) MOCK_DATA.splice(idx, 1)
    return { success: true }
  }
}

import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type OnlineUserItem = { sessionId: string; userId: string; username: string; nickname: string; userIp: string; loginTime: string; expiresAt: string }

const MOCK_DATA: OnlineUserItem[] = [
  { sessionId: "sess-001", userId: "1", username: "admin", nickname: "超级管理员", userIp: "127.0.0.1", loginTime: "2026-08-07T08:00:00.000Z", expiresAt: "2026-08-08T08:00:00.000Z" },
  { sessionId: "sess-002", userId: "2", username: "test", nickname: "测试用户", userIp: "192.168.1.100", loginTime: "2026-08-07T09:30:00.000Z", expiresAt: "2026-08-08T09:30:00.000Z" },
]

export class SystemOnlineUserService {
  static async list(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((u) => u.username.toLowerCase().includes(kw) || u.nickname.toLowerCase().includes(kw)) }
    const total = filtered.length
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.onlineUser.list", { total })
    return { items: filtered.slice(start, start + input.pageSize), total, page: input.page, pageSize: input.pageSize }
  }

  static async forceLogout(operatorId: string, input: { sessionId: string }) {
    const idx = MOCK_DATA.findIndex((u) => u.sessionId === input.sessionId)
    if (idx !== -1) MOCK_DATA.splice(idx, 1)
    domainLog.event("system.onlineUser.forceLogout", { sessionId: input.sessionId })
    domainLog.audit("system.onlineUser.forceLogout", { operatorId, targetType: "SESSION", targetId: input.sessionId })
    return { success: true }
  }

  static async get(id: string) {
    return { id }
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async page(...args: any[]) {
    return {}
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}

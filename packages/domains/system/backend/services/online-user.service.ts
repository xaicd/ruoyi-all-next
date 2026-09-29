import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { listAdminSessions, revokeAdminSession } from "@/modules/shared/backend/auth/session-registry"

export class SystemOnlineUserService {
  static async list(input: { page?: number; pageSize?: number; keyword?: string }) {
    const page = input.page ?? 1
    const pageSize = input.pageSize ?? 20
    const items = listAdminSessions(input.keyword)
    const start = (page - 1) * pageSize
    domainLog.event("system.onlineUser.list", { total: items.length })
    return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize }
  }

  static async forceLogout(operatorId: string, input: { sessionId: string }) {
    revokeAdminSession(input.sessionId)
    domainLog.event("system.onlineUser.forceLogout", { sessionId: input.sessionId })
    domainLog.audit("system.onlineUser.forceLogout", { operatorId, targetType: "SESSION", targetId: input.sessionId })
    return { success: true }
  }

  static async listOnlineUsers(input: { page?: number; pageSize?: number; keyword?: string }) {
    return this.list({ page: input.page ?? 1, pageSize: input.pageSize ?? 20, keyword: input.keyword })
  }

  static async forceLogoutOnlineUser(input: { sessionId: string; operatorId?: string }) {
    return this.forceLogout(input.operatorId ?? "system", { sessionId: input.sessionId })
  }
}

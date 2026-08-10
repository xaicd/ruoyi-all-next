import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type OperateLogItem = { id: string; userId: string; module: string; name: string; type: string; requestMethod: string; requestUrl: string; duration: number; resultCode: number; userIp: string; createdAt: string }

const MOCK_DATA: OperateLogItem[] = [
  { id: "1", userId: "1", module: "system", name: "创建用户", type: "CREATE", requestMethod: "POST", requestUrl: "/api/v1/admin/system/users", duration: 45, resultCode: 0, userIp: "127.0.0.1", createdAt: "2026-08-07T10:30:00.000Z" },
  { id: "2", userId: "1", module: "system", name: "修改角色", type: "UPDATE", requestMethod: "PUT", requestUrl: "/api/v1/admin/system/roles/1", duration: 32, resultCode: 0, userIp: "127.0.0.1", createdAt: "2026-08-07T09:15:00.000Z" },
  { id: "3", userId: "2", module: "infra", name: "查询配置", type: "OTHER", requestMethod: "GET", requestUrl: "/api/v1/admin/infra/configs", duration: 12, resultCode: 0, userIp: "192.168.1.100", createdAt: "2026-08-06T14:00:00.000Z" },
]

export class OperateLogService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((l) => l.name.toLowerCase().includes(kw) || l.requestUrl.toLowerCase().includes(kw)) }
    if (input.module) filtered = filtered.filter((l) => l.module === input.module)
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const total = filtered.length
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.operateLog.page", { total })
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

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}

// Alias for index.ts re-export
export {  as  }

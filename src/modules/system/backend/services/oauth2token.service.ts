import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type OAuth2TokenItem = { id: string; userId: string; username: string; clientId: string; accessToken: string; refreshToken: string; expiresTime: string; createdAt: string }

const MOCK_DATA: OAuth2TokenItem[] = [
  { id: "1", userId: "1", username: "admin", clientId: "ruoyi-admin", accessToken: "at_xxxxx", refreshToken: "rt_xxxxx", expiresTime: "2026-08-08T10:00:00.000Z", createdAt: "2026-08-07T10:00:00.000Z" },
]

export class OAuth2TokenService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((t) => t.username.toLowerCase().includes(kw) || t.clientId.toLowerCase().includes(kw)) }
    domainLog.event("system.oauth2Token.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((t) => t.id === id) ?? null }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((t) => t.id === id); if (idx !== -1) MOCK_DATA.splice(idx, 1); domainLog.event("system.oauth2Token.delete", { id }); return { success: true } }
  static async create(input: any) { return { id: "mock" } }
  static async update(input: any) { return { id: input.id ?? "mock" } }
}

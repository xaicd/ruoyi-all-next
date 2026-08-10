import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type OAuth2ClientItem = { id: string; clientId: string; clientSecret: string; name: string; redirectUri: string; grantTypes: string[]; scopes: string[]; status: string; createdAt: string }

const MOCK_DATA: OAuth2ClientItem[] = [
  { id: "1", clientId: "ruoyi-admin", clientSecret: "***secret***", name: "管理后台", redirectUri: "http://localhost:3100/callback", grantTypes: ["authorization_code", "password"], scopes: ["user:read", "user:write"], status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", clientId: "ruoyi-app", clientSecret: "***secret***", name: "用户端APP", redirectUri: "http://localhost:3200/callback", grantTypes: ["authorization_code"], scopes: ["user:read"], status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class OAuth2ClientService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((c) => c.name.toLowerCase().includes(kw) || c.clientId.toLowerCase().includes(kw)) }
    domainLog.event("system.oauth2Client.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((c) => c.id === id) ?? null }
  static async create(input: any) { const row: OAuth2ClientItem = { id: String(++nextId), clientId: input.clientId, clientSecret: input.clientSecret ?? "***", name: input.name, redirectUri: input.redirectUri ?? "", grantTypes: input.grantTypes ?? [], scopes: input.scopes ?? [], status: "ACTIVE", createdAt: new Date().toISOString() }; MOCK_DATA.push(row); domainLog.event("system.oauth2Client.create", { id: row.id }); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((c) => c.id === input.id); if (idx === -1) throw new Error("OAuth2客户端不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((c) => c.id === id); if (idx === -1) throw new Error("OAuth2客户端不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

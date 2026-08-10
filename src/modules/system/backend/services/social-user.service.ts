import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type SocialUserItem = { id: string; provider: string; nickname: string; avatar: string | null; openId: string; userId: string | null; status: string; createdAt: string }

const MOCK_DATA: SocialUserItem[] = [
  { id: "1", provider: "WECHAT", nickname: "微信用户A", avatar: null, openId: "wx_oABC123", userId: "1", status: "ACTIVE", createdAt: "2026-03-01T10:00:00.000Z" },
  { id: "2", provider: "DOUYIN", nickname: "抖音用户B", avatar: null, openId: "dy_XYZ456", userId: null, status: "ACTIVE", createdAt: "2026-04-01T14:00:00.000Z" },
]
let nextId = 100

export class SocialUserService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((u) => u.nickname.toLowerCase().includes(kw) || u.openId.toLowerCase().includes(kw)) }
    domainLog.event("system.socialUser.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((u) => u.id === id) ?? null }
  static async create(input: any) { const row: SocialUserItem = { id: String(++nextId), provider: input.provider, nickname: input.nickname, avatar: null, openId: input.openId ?? input.externalId ?? "", userId: null, status: "ACTIVE", createdAt: new Date().toISOString() }; MOCK_DATA.push(row); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((u) => u.id === input.id); if (idx === -1) throw new Error("社交用户不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((u) => u.id === id); if (idx === -1) throw new Error("社交用户不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

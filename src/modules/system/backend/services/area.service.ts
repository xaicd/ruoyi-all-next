import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type AreaItem = { id: string; name: string; parentId: string | null; level: number; status: string; createdAt: string }

const MOCK_DATA: AreaItem[] = [
  { id: "1", name: "中国", parentId: null, level: 1, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "广东省", parentId: "1", level: 2, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "3", name: "深圳市", parentId: "2", level: 3, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "4", name: "北京市", parentId: "1", level: 2, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class AreaService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((a) => a.name.toLowerCase().includes(kw)) }
    const total = filtered.length
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.area.page", { total })
    return { items: filtered.slice(start, start + input.pageSize), total, page: input.page, pageSize: input.pageSize }
  }

  static async get(id: string) {
    const item = MOCK_DATA.find((a) => a.id === id)
    if (!item) throw new Error("地区不存在")
    return item
  }

  static async create(input: any) {
    const row: AreaItem = { id: String(++nextId), name: input.name, parentId: input.parentId ?? null, level: input.level ?? 1, status: "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(row)
    domainLog.event("system.area.create", { id: row.id })
    return { id: row.id }
  }

  static async update(input: any) {
    const idx = MOCK_DATA.findIndex((a) => a.id === input.id)
    if (idx === -1) throw new Error("地区不存在")
    MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input, createdAt: MOCK_DATA[idx].createdAt }
    domainLog.event("system.area.update", { id: input.id })
    return { id: input.id }
  }

  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error("地区不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("system.area.delete", { id })
    return { success: true }
  }
}

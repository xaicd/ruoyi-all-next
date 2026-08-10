import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type DbConfigItem = { id: string; name: string; url: string; driver: string; username: string; status: string; createdAt: string }

const MOCK_DATA: DbConfigItem[] = [
  { id: "1", name: "主库 (PostgreSQL)", url: "postgresql://localhost:5432/ruoyi_next", driver: "postgresql", username: "ruoyi", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "从库 (MySQL)", url: "mysql://localhost:3306/ruoyi_slave", driver: "mysql", username: "ruoyi", status: "DISABLED", createdAt: "2026-01-01T00:00:00.000Z" },
]
let nextId = 100

export class DbConfigService {
  static async page(input: any) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) { const kw = input.keyword.toLowerCase(); filtered = filtered.filter((c) => c.name.toLowerCase().includes(kw) || c.driver.toLowerCase().includes(kw)) }
    domainLog.event("infra.dbConfig.page", { total: filtered.length })
    const start = (input.page - 1) * input.pageSize
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  static async get(id: string) { return MOCK_DATA.find((c) => c.id === id) ?? null }
  static async create(input: any) { const row: DbConfigItem = { id: String(++nextId), name: input.name, url: input.url ?? "", driver: input.driver ?? "postgresql", username: input.username ?? "", status: "ACTIVE", createdAt: new Date().toISOString() }; MOCK_DATA.push(row); domainLog.event("infra.dbConfig.create", { id: row.id }); return { id: row.id } }
  static async update(input: any) { const idx = MOCK_DATA.findIndex((c) => c.id === input.id); if (idx === -1) throw new Error("数据源不存在"); MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...input }; return { id: input.id } }
  static async delete(id: string) { const idx = MOCK_DATA.findIndex((c) => c.id === id); if (idx === -1) throw new Error("数据源不存在"); MOCK_DATA.splice(idx, 1); return { success: true } }
}

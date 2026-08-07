import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesTmToolItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesTmToolCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesTmToolUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesTmToolPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesTmToolItem[] = [
  { id: "mes-tm-tool-001", name: "MesTmTool 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-tm-tool-002", name: "MesTmTool 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesTmToolService {
  /** 分页查询 */
  static async page(input: MesTmToolPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesTmTool.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesTmTool不存在")
    domainLog.event("mes.mesTmTool.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesTmToolCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-tm-tool-${++nextId}`
    const item: MesTmToolItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesTmTool.create", { id })
    domainLog.audit("mes.mesTmTool.create", { targetType: "MES_MESTMTOOL", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesTmToolUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesTmTool不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesTmTool.update", { id: input.id })
    domainLog.audit("mes.mesTmTool.update", { targetType: "MES_MESTMTOOL", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesTmTool不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesTmTool.delete", { id })
    domainLog.audit("mes.mesTmTool.delete", { targetType: "MES_MESTMTOOL", targetId: id })
    return true
  }
}

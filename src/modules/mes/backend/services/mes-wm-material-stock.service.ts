import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmMaterialStockItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmMaterialStockCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmMaterialStockUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmMaterialStockPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmMaterialStockItem[] = [
  { id: "mes-wm-material-stock-001", name: "MesWmMaterialStock 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-material-stock-002", name: "MesWmMaterialStock 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmMaterialStockService {
  /** 分页查询 */
  static async page(input: MesWmMaterialStockPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmMaterialStock.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmMaterialStock不存在")
    domainLog.event("mes.mesWmMaterialStock.get", { id })
    return item
  }
  /** 更新 */
  static async update(input: MesWmMaterialStockUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmMaterialStock不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmMaterialStock.update", { id: input.id })
    domainLog.audit("mes.mesWmMaterialStock.update", { targetType: "MES_MESWMMATERIALSTOCK", targetId: input.id })
    return true
  }
}

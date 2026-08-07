import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmMiscReceiptItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmMiscReceiptCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmMiscReceiptUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmMiscReceiptPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmMiscReceiptItem[] = [
  { id: "mes-wm-misc-receipt-001", name: "MesWmMiscReceipt 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-misc-receipt-002", name: "MesWmMiscReceipt 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmMiscReceiptService {
  /** 分页查询 */
  static async page(input: MesWmMiscReceiptPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmMiscReceipt.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmMiscReceipt不存在")
    domainLog.event("mes.mesWmMiscReceipt.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmMiscReceiptCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-misc-receipt-${++nextId}`
    const item: MesWmMiscReceiptItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmMiscReceipt.create", { id })
    domainLog.audit("mes.mesWmMiscReceipt.create", { targetType: "MES_MESWMMISCRECEIPT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmMiscReceiptUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmMiscReceipt不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmMiscReceipt.update", { id: input.id })
    domainLog.audit("mes.mesWmMiscReceipt.update", { targetType: "MES_MESWMMISCRECEIPT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmMiscReceipt不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmMiscReceipt.delete", { id })
    domainLog.audit("mes.mesWmMiscReceipt.delete", { targetType: "MES_MESWMMISCRECEIPT", targetId: id })
    return true
  }
}

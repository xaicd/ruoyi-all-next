import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesDvCheckRecordLineItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesDvCheckRecordLineCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvCheckRecordLineUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvCheckRecordLinePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesDvCheckRecordLineItem[] = [
  { id: "mes-dv-check-record-line-001", name: "MesDvCheckRecordLine 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-dv-check-record-line-002", name: "MesDvCheckRecordLine 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesDvCheckRecordLineService {
  /** 分页查询 */
  static async page(input: MesDvCheckRecordLinePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesDvCheckRecordLine.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesDvCheckRecordLine不存在")
    domainLog.event("mes.mesDvCheckRecordLine.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesDvCheckRecordLineCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-dv-check-record-line-${++nextId}`
    const item: MesDvCheckRecordLineItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesDvCheckRecordLine.create", { id })
    domainLog.audit("mes.mesDvCheckRecordLine.create", { targetType: "MES_MESDVCHECKRECORDLINE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesDvCheckRecordLineUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesDvCheckRecordLine不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesDvCheckRecordLine.update", { id: input.id })
    domainLog.audit("mes.mesDvCheckRecordLine.update", { targetType: "MES_MESDVCHECKRECORDLINE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesDvCheckRecordLine不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesDvCheckRecordLine.delete", { id })
    domainLog.audit("mes.mesDvCheckRecordLine.delete", { targetType: "MES_MESDVCHECKRECORDLINE", targetId: id })
    return true
  }
}

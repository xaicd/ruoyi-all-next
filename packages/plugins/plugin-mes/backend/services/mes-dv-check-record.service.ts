import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesDvCheckRecordItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesDvCheckRecordCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvCheckRecordUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvCheckRecordPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesDvCheckRecordItem[] = [
  { id: "mes-dv-check-record-001", name: "MesDvCheckRecord 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-dv-check-record-002", name: "MesDvCheckRecord 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesDvCheckRecordService {
  /** 分页查询 */
  static async page(input: MesDvCheckRecordPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesDvCheckRecord.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesDvCheckRecord不存在")
    domainLog.event("mes.mesDvCheckRecord.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesDvCheckRecordCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-dv-check-record-${++nextId}`
    const item: MesDvCheckRecordItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesDvCheckRecord.create", { id })
    domainLog.audit("mes.mesDvCheckRecord.create", { targetType: "MES_MESDVCHECKRECORD", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesDvCheckRecordUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesDvCheckRecord不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesDvCheckRecord.update", { id: input.id })
    domainLog.audit("mes.mesDvCheckRecord.update", { targetType: "MES_MESDVCHECKRECORD", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesDvCheckRecord不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesDvCheckRecord.delete", { id })
    domainLog.audit("mes.mesDvCheckRecord.delete", { targetType: "MES_MESDVCHECKRECORD", targetId: id })
    return true
  }
}

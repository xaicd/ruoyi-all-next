import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotDataRuleItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotDataRuleCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotDataRuleUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotDataRulePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotDataRuleItem[] = [
  { id: "iot-data-rule-001", name: "IotDataRule 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-data-rule-002", name: "IotDataRule 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotDataRuleService {
  /** 分页查询 */
  static async page(input: IotDataRulePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("iot.iotDataRule.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotDataRule不存在")
    domainLog.event("iot.iotDataRule.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: IotDataRuleCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `iot-data-rule-${++nextId}`
    const item: IotDataRuleItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("iot.iotDataRule.create", { id })
    domainLog.audit("iot.iotDataRule.create", { targetType: "IOT_IOTDATARULE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: IotDataRuleUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("IotDataRule不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("iot.iotDataRule.update", { id: input.id })
    domainLog.audit("iot.iotDataRule.update", { targetType: "IOT_IOTDATARULE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("IotDataRule不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("iot.iotDataRule.delete", { id })
    domainLog.audit("iot.iotDataRule.delete", { targetType: "IOT_IOTDATARULE", targetId: id })
    return true
  }
}

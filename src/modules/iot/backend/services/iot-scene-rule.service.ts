import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotSceneRuleItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotSceneRuleCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotSceneRuleUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotSceneRulePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotSceneRuleItem[] = [
  { id: "iot-scene-rule-001", name: "IotSceneRule 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-scene-rule-002", name: "IotSceneRule 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotSceneRuleService {
  /** 分页查询 */
  static async page(input: IotSceneRulePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("iot.iotSceneRule.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotSceneRule不存在")
    domainLog.event("iot.iotSceneRule.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: IotSceneRuleCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `iot-scene-rule-${++nextId}`
    const item: IotSceneRuleItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("iot.iotSceneRule.create", { id })
    domainLog.audit("iot.iotSceneRule.create", { targetType: "IOT_IOTSCENERULE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: IotSceneRuleUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("IotSceneRule不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("iot.iotSceneRule.update", { id: input.id })
    domainLog.audit("iot.iotSceneRule.update", { targetType: "IOT_IOTSCENERULE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("IotSceneRule不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("iot.iotSceneRule.delete", { id })
    domainLog.audit("iot.iotSceneRule.delete", { targetType: "IOT_IOTSCENERULE", targetId: id })
    return true
  }
}

import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type IotOtaTaskItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type IotOtaTaskCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotOtaTaskUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type IotOtaTaskPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: IotOtaTaskItem[] = [
  { id: "iot-ota-task-001", name: "IotOtaTask 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "iot-ota-task-002", name: "IotOtaTask 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class IotOtaTaskService {
  /** 分页查询 */
  static async page(input: IotOtaTaskPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("iot.iotOtaTask.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("IotOtaTask不存在")
    domainLog.event("iot.iotOtaTask.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: IotOtaTaskCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `iot-ota-task-${++nextId}`
    const item: IotOtaTaskItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("iot.iotOtaTask.create", { id })
    domainLog.audit("iot.iotOtaTask.create", { targetType: "IOT_IOTOTATASK", targetId: id })
    return { id }
  }
}

import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type DataSourceConfigItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type DataSourceConfigCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type DataSourceConfigUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type DataSourceConfigPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: DataSourceConfigItem[] = [
  { id: "data-source-config-001", name: "DataSourceConfig 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "data-source-config-002", name: "DataSourceConfig 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class DataSourceConfigService {
  /** 分页查询 */
  static async page(input: DataSourceConfigPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("infra.dataSourceConfig.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("DataSourceConfig不存在")
    domainLog.event("infra.dataSourceConfig.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: DataSourceConfigCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `data-source-config-${++nextId}`
    const item: DataSourceConfigItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("infra.dataSourceConfig.create", { id })
    domainLog.audit("infra.dataSourceConfig.create", { targetType: "INFRA_DATASOURCECONFIG", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: DataSourceConfigUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("DataSourceConfig不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("infra.dataSourceConfig.update", { id: input.id })
    domainLog.audit("infra.dataSourceConfig.update", { targetType: "INFRA_DATASOURCECONFIG", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("DataSourceConfig不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("infra.dataSourceConfig.delete", { id })
    domainLog.audit("infra.dataSourceConfig.delete", { targetType: "INFRA_DATASOURCECONFIG", targetId: id })
    return true
  }
}

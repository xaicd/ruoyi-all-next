import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type DictTypeItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type DictTypeCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type DictTypeUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type DictTypePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: DictTypeItem[] = [
  { id: "dict-type-001", name: "DictType 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "dict-type-002", name: "DictType 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class DictTypeService {
  /** 分页查询 */
  static async page(input: DictTypePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("system.dictType.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 创建 */
  static async create(input: DictTypeCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `dict-type-${++nextId}`
    const item: DictTypeItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("system.dictType.create", { id })
    domainLog.audit("system.dictType.create", { targetType: "SYSTEM_DICTTYPE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: DictTypeUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("DictType不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("system.dictType.update", { id: input.id })
    domainLog.audit("system.dictType.update", { targetType: "SYSTEM_DICTTYPE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("DictType不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("system.dictType.delete", { id })
    domainLog.audit("system.dictType.delete", { targetType: "SYSTEM_DICTTYPE", targetId: id })
    return true
  }
}

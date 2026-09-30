import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type GoViewProjectItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type GoViewProjectCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type GoViewProjectUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type GoViewProjectPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: GoViewProjectItem[] = [
  { id: "go-view-project-001", name: "GoViewProject 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "go-view-project-002", name: "GoViewProject 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class GoViewProjectService {
  /** 分页查询 */
  static async page(input: GoViewProjectPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("report.goViewProject.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("GoViewProject不存在")
    domainLog.event("report.goViewProject.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: GoViewProjectCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `go-view-project-${++nextId}`
    const item: GoViewProjectItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("report.goViewProject.create", { id })
    domainLog.audit("report.goViewProject.create", { targetType: "REPORT_GOVIEWPROJECT", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: GoViewProjectUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("GoViewProject不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("report.goViewProject.update", { id: input.id })
    domainLog.audit("report.goViewProject.update", { targetType: "REPORT_GOVIEWPROJECT", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("GoViewProject不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("report.goViewProject.delete", { id })
    domainLog.audit("report.goViewProject.delete", { targetType: "REPORT_GOVIEWPROJECT", targetId: id })
    return true
  }
}

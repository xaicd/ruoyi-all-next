import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type JobItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type JobCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type JobUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type JobPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: JobItem[] = [
  { id: "job-001", name: "Job 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "job-002", name: "Job 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class JobService {
  /** 分页查询 */
  static async page(input: JobPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("infra.job.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("Job不存在")
    domainLog.event("infra.job.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: JobCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `job-${++nextId}`
    const item: JobItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("infra.job.create", { id })
    domainLog.audit("infra.job.create", { targetType: "INFRA_JOB", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: JobUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("Job不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("infra.job.update", { id: input.id })
    domainLog.audit("infra.job.update", { targetType: "INFRA_JOB", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("Job不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("infra.job.delete", { id })
    domainLog.audit("infra.job.delete", { targetType: "INFRA_JOB", targetId: id })
    return true
  }
}

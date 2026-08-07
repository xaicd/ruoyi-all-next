import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmStockTakingTaskItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmStockTakingTaskCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmStockTakingTaskUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmStockTakingTaskPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmStockTakingTaskItem[] = [
  { id: "mes-wm-stock-taking-task-001", name: "MesWmStockTakingTask 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-stock-taking-task-002", name: "MesWmStockTakingTask 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmStockTakingTaskService {
  /** 分页查询 */
  static async page(input: MesWmStockTakingTaskPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmStockTakingTask.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmStockTakingTask不存在")
    domainLog.event("mes.mesWmStockTakingTask.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmStockTakingTaskCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-stock-taking-task-${++nextId}`
    const item: MesWmStockTakingTaskItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmStockTakingTask.create", { id })
    domainLog.audit("mes.mesWmStockTakingTask.create", { targetType: "MES_MESWMSTOCKTAKINGTASK", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmStockTakingTaskUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmStockTakingTask不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmStockTakingTask.update", { id: input.id })
    domainLog.audit("mes.mesWmStockTakingTask.update", { targetType: "MES_MESWMSTOCKTAKINGTASK", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmStockTakingTask不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmStockTakingTask.delete", { id })
    domainLog.audit("mes.mesWmStockTakingTask.delete", { targetType: "MES_MESWMSTOCKTAKINGTASK", targetId: id })
    return true
  }
}

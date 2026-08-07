import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmPackageLineItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmPackageLineCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmPackageLineUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmPackageLinePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmPackageLineItem[] = [
  { id: "mes-wm-package-line-001", name: "MesWmPackageLine 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-package-line-002", name: "MesWmPackageLine 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmPackageLineService {
  /** 分页查询 */
  static async page(input: MesWmPackageLinePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmPackageLine.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmPackageLine不存在")
    domainLog.event("mes.mesWmPackageLine.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmPackageLineCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-package-line-${++nextId}`
    const item: MesWmPackageLineItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmPackageLine.create", { id })
    domainLog.audit("mes.mesWmPackageLine.create", { targetType: "MES_MESWMPACKAGELINE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmPackageLineUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmPackageLine不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmPackageLine.update", { id: input.id })
    domainLog.audit("mes.mesWmPackageLine.update", { targetType: "MES_MESWMPACKAGELINE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmPackageLine不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmPackageLine.delete", { id })
    domainLog.audit("mes.mesWmPackageLine.delete", { targetType: "MES_MESWMPACKAGELINE", targetId: id })
    return true
  }
}

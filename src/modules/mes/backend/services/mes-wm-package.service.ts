import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesWmPackageItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesWmPackageCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmPackageUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesWmPackagePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesWmPackageItem[] = [
  { id: "mes-wm-package-001", name: "MesWmPackage 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-wm-package-002", name: "MesWmPackage 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesWmPackageService {
  /** 分页查询 */
  static async page(input: MesWmPackagePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesWmPackage.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesWmPackage不存在")
    domainLog.event("mes.mesWmPackage.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesWmPackageCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-wm-package-${++nextId}`
    const item: MesWmPackageItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesWmPackage.create", { id })
    domainLog.audit("mes.mesWmPackage.create", { targetType: "MES_MESWMPACKAGE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesWmPackageUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesWmPackage不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesWmPackage.update", { id: input.id })
    domainLog.audit("mes.mesWmPackage.update", { targetType: "MES_MESWMPACKAGE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesWmPackage不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesWmPackage.delete", { id })
    domainLog.audit("mes.mesWmPackage.delete", { targetType: "MES_MESWMPACKAGE", targetId: id })
    return true
  }
}

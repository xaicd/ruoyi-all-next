import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesDvMachineryItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesDvMachineryCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvMachineryUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesDvMachineryPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesDvMachineryItem[] = [
  { id: "mes-dv-machinery-001", name: "MesDvMachinery 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-dv-machinery-002", name: "MesDvMachinery 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesDvMachineryService {
  /** 分页查询 */
  static async page(input: MesDvMachineryPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesDvMachinery.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesDvMachinery不存在")
    domainLog.event("mes.mesDvMachinery.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesDvMachineryCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-dv-machinery-${++nextId}`
    const item: MesDvMachineryItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesDvMachinery.create", { id })
    domainLog.audit("mes.mesDvMachinery.create", { targetType: "MES_MESDVMACHINERY", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: MesDvMachineryUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("MesDvMachinery不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("mes.mesDvMachinery.update", { id: input.id })
    domainLog.audit("mes.mesDvMachinery.update", { targetType: "MES_MESDVMACHINERY", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesDvMachinery不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesDvMachinery.delete", { id })
    domainLog.audit("mes.mesDvMachinery.delete", { targetType: "MES_MESDVMACHINERY", targetId: id })
    return true
  }
}

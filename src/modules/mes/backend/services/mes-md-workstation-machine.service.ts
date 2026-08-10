import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MesMdWorkstationMachineItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MesMdWorkstationMachineCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesMdWorkstationMachineUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MesMdWorkstationMachinePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MesMdWorkstationMachineItem[] = [
  { id: "mes-md-workstation-machine-001", name: "MesMdWorkstationMachine 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mes-md-workstation-machine-002", name: "MesMdWorkstationMachine 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MesMdWorkstationMachineService {
  /** 分页查询 */
  static async page(input: MesMdWorkstationMachinePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mes.mesMdWorkstationMachine.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MesMdWorkstationMachine不存在")
    domainLog.event("mes.mesMdWorkstationMachine.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: MesMdWorkstationMachineCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `mes-md-workstation-machine-${++nextId}`
    const item: MesMdWorkstationMachineItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("mes.mesMdWorkstationMachine.create", { id })
    domainLog.audit("mes.mesMdWorkstationMachine.create", { targetType: "MES_MESMDWORKSTATIONMACHINE", targetId: id })
    return { id }
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MesMdWorkstationMachine不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mes.mesMdWorkstationMachine.delete", { id })
    domainLog.audit("mes.mesMdWorkstationMachine.delete", { targetType: "MES_MESMDWORKSTATIONMACHINE", targetId: id })
    return true
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

}

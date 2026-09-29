import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type PayChannelItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type PayChannelCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayChannelUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayChannelPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: PayChannelItem[] = [
  { id: "pay-channel-001", name: "PayChannel 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "pay-channel-002", name: "PayChannel 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class PayChannelService {
  /** 分页查询 */
  static async page(input: PayChannelPageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("pay.payChannel.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("PayChannel不存在")
    domainLog.event("pay.payChannel.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: PayChannelCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `pay-channel-${++nextId}`
    const item: PayChannelItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("pay.payChannel.create", { id })
    domainLog.audit("pay.payChannel.create", { targetType: "PAY_PAYCHANNEL", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: PayChannelUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("PayChannel不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("pay.payChannel.update", { id: input.id })
    domainLog.audit("pay.payChannel.update", { targetType: "PAY_PAYCHANNEL", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("PayChannel不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("pay.payChannel.delete", { id })
    domainLog.audit("pay.payChannel.delete", { targetType: "PAY_PAYCHANNEL", targetId: id })
    return true
  }
}

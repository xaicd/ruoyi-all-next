import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MpMessageTemplateItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MpMessageTemplateCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpMessageTemplateUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpMessageTemplatePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MpMessageTemplateItem[] = [
  { id: "mp-message-template-001", name: "MpMessageTemplate 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mp-message-template-002", name: "MpMessageTemplate 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MpMessageTemplateService {
  /** 分页查询 */
  static async page(input: MpMessageTemplatePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("mp.mpMessageTemplate.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("MpMessageTemplate不存在")
    domainLog.event("mp.mpMessageTemplate.get", { id })
    return item
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("MpMessageTemplate不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("mp.mpMessageTemplate.delete", { id })
    domainLog.audit("mp.mpMessageTemplate.delete", { targetType: "MP_MPMESSAGETEMPLATE", targetId: id })
    return true
  }
}

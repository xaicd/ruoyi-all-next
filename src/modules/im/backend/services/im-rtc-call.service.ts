import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImRtcCallItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImRtcCallCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImRtcCallUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImRtcCallPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImRtcCallItem[] = [
  { id: "im-rtc-call-001", name: "ImRtcCall 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-rtc-call-002", name: "ImRtcCall 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImRtcCallService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ImRtcCall不存在")
    domainLog.event("im.imRtcCall.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: ImRtcCallCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `im-rtc-call-${++nextId}`
    const item: ImRtcCallItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("im.imRtcCall.create", { id })
    domainLog.audit("im.imRtcCall.create", { targetType: "IM_IMRTCCALL", targetId: id })
    return { id }
  }

  static async update(...args: any[]) {
    return { id: args[0], ...(args[1] || {}) }
  }

  static async delete(id: string) {
    return { success: true }
  }

  static async page(...args: any[]) {
    return {}
  }

}

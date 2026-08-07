import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImChannelMaterialItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImChannelMaterialCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImChannelMaterialUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImChannelMaterialPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImChannelMaterialItem[] = [
  { id: "im-channel-material-001", name: "ImChannelMaterial 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-channel-material-002", name: "ImChannelMaterial 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImChannelMaterialService {
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("ImChannelMaterial不存在")
    domainLog.event("im.imChannelMaterial.get", { id })
    return item
  }
}

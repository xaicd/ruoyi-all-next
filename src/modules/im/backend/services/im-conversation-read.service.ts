import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImConversationReadItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImConversationReadCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImConversationReadUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImConversationReadPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImConversationReadItem[] = [
  { id: "im-conversation-read-001", name: "ImConversationRead 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-conversation-read-002", name: "ImConversationRead 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImConversationReadService {

  static async get(id: string) {
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

  static async create(input: Record<string, any>) {
    return { id: String(Date.now()), ...input }
  }

}

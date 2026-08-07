import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type MpOpenItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type MpOpenCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpOpenUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type MpOpenPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: MpOpenItem[] = [
  { id: "mp-open-001", name: "MpOpen 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "mp-open-002", name: "MpOpen 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class MpOpenService {
}

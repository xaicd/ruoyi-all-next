import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type ImRtcLiveKitItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type ImRtcLiveKitCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImRtcLiveKitUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type ImRtcLiveKitPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: ImRtcLiveKitItem[] = [
  { id: "im-rtc-live-kit-001", name: "ImRtcLiveKit 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "im-rtc-live-kit-002", name: "ImRtcLiveKit 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class ImRtcLiveKitService {
}

import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type SmsCallbackItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type SmsCallbackCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type SmsCallbackUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type SmsCallbackPageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: SmsCallbackItem[] = [
  { id: "sms-callback-001", name: "SmsCallback 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "sms-callback-002", name: "SmsCallback 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class SmsCallbackService {
}

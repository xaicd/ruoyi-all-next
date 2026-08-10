import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type PayWalletRechargeItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type PayWalletRechargeCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayWalletRechargeUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayWalletRechargePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: PayWalletRechargeItem[] = [
  { id: "pay-wallet-recharge-001", name: "PayWalletRecharge 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "pay-wallet-recharge-002", name: "PayWalletRecharge 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class PayWalletRechargeService {

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

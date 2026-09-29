import { domainLog } from "@/modules/shared/backend/lib/domain-log"

// ============ Types ============

export type PayWalletRechargePackageItem = {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
  createdAt: string
}

export type PayWalletRechargePackageCreateInput = {
  name: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayWalletRechargePackageUpdateInput = {
  id: string
  name?: string
  status?: "ACTIVE" | "DISABLED"
}

export type PayWalletRechargePackagePageQuery = {
  page: number
  pageSize: number
  keyword?: string
}

// ============ Mock Data ============

const MOCK_DATA: PayWalletRechargePackageItem[] = [
  { id: "pay-wallet-recharge-package-001", name: "PayWalletRechargePackage 示例1", status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z" },
  { id: "pay-wallet-recharge-package-002", name: "PayWalletRechargePackage 示例2", status: "ACTIVE", createdAt: "2026-02-01T00:00:00.000Z" },
]

let nextId = 100

// ============ Service ============

export class PayWalletRechargePackageService {
  /** 分页查询 */
  static async page(input: PayWalletRechargePackagePageQuery) {
    let filtered = [...MOCK_DATA]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("pay.payWalletRechargePackage.page", { page: input.page, total: filtered.length })
    return { items: filtered.slice(start, start + input.pageSize), total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
  /** 获取详情 */
  static async get(id: string) {
    const item = MOCK_DATA.find((d) => d.id === id)
    if (!item) throw new Error("PayWalletRechargePackage不存在")
    domainLog.event("pay.payWalletRechargePackage.get", { id })
    return item
  }
  /** 创建 */
  static async create(input: PayWalletRechargePackageCreateInput) {
    if (MOCK_DATA.find((d) => d.name === input.name)) throw new Error("名称已存在")
    const id = `pay-wallet-recharge-package-${++nextId}`
    const item: PayWalletRechargePackageItem = { id, name: input.name, status: input.status || "ACTIVE", createdAt: new Date().toISOString() }
    MOCK_DATA.push(item)
    domainLog.event("pay.payWalletRechargePackage.create", { id })
    domainLog.audit("pay.payWalletRechargePackage.create", { targetType: "PAY_PAYWALLETRECHARGEPACKAGE", targetId: id })
    return { id }
  }
  /** 更新 */
  static async update(input: PayWalletRechargePackageUpdateInput) {
    const item = MOCK_DATA.find((d) => d.id === input.id)
    if (!item) throw new Error("PayWalletRechargePackage不存在")
    if (input.name) item.name = input.name
    if (input.status) item.status = input.status
    domainLog.event("pay.payWalletRechargePackage.update", { id: input.id })
    domainLog.audit("pay.payWalletRechargePackage.update", { targetType: "PAY_PAYWALLETRECHARGEPACKAGE", targetId: input.id })
    return true
  }
  /** 删除 */
  static async delete(id: string) {
    const idx = MOCK_DATA.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error("PayWalletRechargePackage不存在")
    MOCK_DATA.splice(idx, 1)
    domainLog.event("pay.payWalletRechargePackage.delete", { id })
    domainLog.audit("pay.payWalletRechargePackage.delete", { targetType: "PAY_PAYWALLETRECHARGEPACKAGE", targetId: id })
    return true
  }
}

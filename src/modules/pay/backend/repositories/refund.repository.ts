/**
 * PayRefund Repository - 退款单
 */

import type { PageResult } from "@/modules/shared/backend/lib/database"

export type PayRefundRow = {
  id: string
  orderId: string
  merchantOrderId: string
  reason: string
  amount: number
  status: string // WAITING | SUCCESS | FAIL
  channelCode: string
  channelRefundNo: string | null
  successTime: string | null
  createdAt: string
}

export type PayRefundListParams = { page: number; pageSize: number; keyword?: string; status?: string }

const MEMORY_STORE: PayRefundRow[] = [
  { id: "1", orderId: "5", merchantOrderId: "ORD20260105001", reason: "用户申请退款", amount: 5000, status: "SUCCESS", channelCode: "alipay_pc", channelRefundNo: "RF2026010600001", successTime: "2026-01-06T10:00:00.000Z", createdAt: "2026-01-06T09:30:00.000Z" },
  { id: "2", orderId: "2", merchantOrderId: "ORD20260102001", reason: "商品质量问题", amount: 599900, status: "WAITING", channelCode: "alipay_pc", channelRefundNo: null, successTime: null, createdAt: "2026-01-08T14:00:00.000Z" },
]

export const PayRefundRepository = {
  async findList(params: PayRefundListParams): Promise<PageResult<PayRefundRow>> {
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((r) => r.reason.toLowerCase().includes(kw) || r.merchantOrderId.toLowerCase().includes(kw)) }
    if (params.status) filtered = filtered.filter((r) => r.status === params.status)
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<PayRefundRow | null> {
    return MEMORY_STORE.find((r) => r.id === id) ?? null
  },
}

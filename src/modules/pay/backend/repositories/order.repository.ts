/**
 * PayOrder Repository - 支付订单
 */

import type { PageResult } from "@/modules/shared/backend/lib/database"

export type PayOrderRow = {
  id: string
  merchantOrderId: string
  subject: string
  amount: number // 分
  status: string // WAITING | SUCCESS | CLOSED | REFUND
  channelCode: string // wx_pub | alipay_pc | mock
  channelOrderNo: string | null
  userIp: string | null
  expireTime: string | null
  successTime: string | null
  createdAt: string
  updatedAt: string
}

export type PayOrderListParams = { page: number; pageSize: number; keyword?: string; status?: string; channelCode?: string }

const MEMORY_STORE: PayOrderRow[] = [
  { id: "1", merchantOrderId: "ORD20260101001", subject: "会员充值-月度", amount: 9900, status: "SUCCESS", channelCode: "wx_pub", channelOrderNo: "4200001234202601010001", userIp: "192.168.1.100", expireTime: null, successTime: "2026-01-01T10:05:00.000Z", createdAt: "2026-01-01T10:00:00.000Z", updatedAt: "2026-01-01T10:05:00.000Z" },
  { id: "2", merchantOrderId: "ORD20260102001", subject: "商品购买-iPhone", amount: 599900, status: "SUCCESS", channelCode: "alipay_pc", channelOrderNo: "2026010222001400001", userIp: "10.0.0.50", expireTime: null, successTime: "2026-01-02T14:30:00.000Z", createdAt: "2026-01-02T14:25:00.000Z", updatedAt: "2026-01-02T14:30:00.000Z" },
  { id: "3", merchantOrderId: "ORD20260103001", subject: "订单支付-测试", amount: 100, status: "WAITING", channelCode: "mock", channelOrderNo: null, userIp: "127.0.0.1", expireTime: "2026-01-03T12:30:00.000Z", successTime: null, createdAt: "2026-01-03T12:00:00.000Z", updatedAt: "2026-01-03T12:00:00.000Z" },
  { id: "4", merchantOrderId: "ORD20260104001", subject: "会员充值-年度", amount: 9990, status: "CLOSED", channelCode: "wx_pub", channelOrderNo: null, userIp: "192.168.1.200", expireTime: "2026-01-04T08:30:00.000Z", successTime: null, createdAt: "2026-01-04T08:00:00.000Z", updatedAt: "2026-01-04T09:00:00.000Z" },
  { id: "5", merchantOrderId: "ORD20260105001", subject: "退款测试订单", amount: 5000, status: "REFUND", channelCode: "alipay_pc", channelOrderNo: "2026010522001400005", userIp: "10.0.0.100", expireTime: null, successTime: "2026-01-05T16:00:00.000Z", createdAt: "2026-01-05T15:55:00.000Z", updatedAt: "2026-01-06T10:00:00.000Z" },
]

export const PayOrderRepository = {
  async findList(params: PayOrderListParams): Promise<PageResult<PayOrderRow>> {
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((o) => o.subject.toLowerCase().includes(kw) || o.merchantOrderId.toLowerCase().includes(kw)) }
    if (params.status) filtered = filtered.filter((o) => o.status === params.status)
    if (params.channelCode) filtered = filtered.filter((o) => o.channelCode === params.channelCode)
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<PayOrderRow | null> {
    return MEMORY_STORE.find((o) => o.id === id) ?? null
  },
}

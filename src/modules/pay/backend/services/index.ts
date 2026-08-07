import type { PayPageQueryInput, PayOrderCreateInput, PayRefundCreateInput } from "../validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

type PayOrderStatus = "WAITING" | "SUCCESS" | "CLOSED" | "REFUNDING" | "REFUNDED"

type PayOrder = {
  id: string
  appId: string
  channelCode: string
  merchantOrderId: string
  subject: string
  amount: number
  status: PayOrderStatus
  createdAt: string
}

type PayRefund = {
  id: string
  payOrderId: string
  refundAmount: number
  reason: string
  status: "PENDING" | "SUCCESS" | "FAILED"
  createdAt: string
}

const MOCK_PAY_ORDERS: PayOrder[] = [
  {
    id: "pay-order-001",
    appId: "app-001",
    channelCode: "WEIXIN_NATIVE",
    merchantOrderId: "MO-20260801-001",
    subject: "商城订单支付",
    amount: 9900,
    status: "SUCCESS",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "pay-order-002",
    appId: "app-001",
    channelCode: "ALIPAY_PC",
    merchantOrderId: "MO-20260802-002",
    subject: "会员充值",
    amount: 19900,
    status: "WAITING",
    createdAt: "2026-08-02T14:30:00.000Z",
  },
]

const MOCK_PAY_REFUNDS: PayRefund[] = [
  {
    id: "pay-refund-001",
    payOrderId: "pay-order-001",
    refundAmount: 9900,
    reason: "用户申请退款",
    status: "SUCCESS",
    createdAt: "2026-08-03T09:00:00.000Z",
  },
]

export class PayService {
  static async listOrders(input: PayPageQueryInput) {
    domainLog.event("pay.order.list", {
      page: input.page,
      pageSize: input.pageSize,
      status: input.status,
      hasKeyword: Boolean(input.keyword),
    })

    let filtered = [...MOCK_PAY_ORDERS]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          o.merchantOrderId.toLowerCase().includes(kw) ||
          o.subject.toLowerCase().includes(kw),
      )
    }
    if (input.status) {
      filtered = filtered.filter((o) => o.status === input.status)
    }

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async createOrder(input: PayOrderCreateInput) {
    const id = `pay-order-${Date.now()}`
    const order: PayOrder = {
      id,
      appId: input.appId,
      channelCode: input.channelCode,
      merchantOrderId: input.merchantOrderId,
      subject: input.subject,
      amount: input.amount,
      status: "WAITING",
      createdAt: new Date().toISOString(),
    }
    MOCK_PAY_ORDERS.push(order)

    domainLog.event("pay.order.create", {
      orderId: id,
      appId: input.appId,
      channelCode: input.channelCode,
      amount: input.amount,
    })
    domainLog.audit("pay.order.create", {
      targetType: "PAY_ORDER",
      targetId: id,
      merchantOrderId: input.merchantOrderId,
      amount: input.amount,
    })

    return order
  }

  static async listRefunds(input: PayPageQueryInput) {
    domainLog.event("pay.refund.list", {
      page: input.page,
      pageSize: input.pageSize,
    })

    const start = (input.page - 1) * input.pageSize
    return {
      items: MOCK_PAY_REFUNDS.slice(start, start + input.pageSize),
      total: MOCK_PAY_REFUNDS.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async createRefund(input: PayRefundCreateInput) {
    const order = MOCK_PAY_ORDERS.find((o) => o.id === input.payOrderId)
    if (!order) {
      throw new Error("支付单不存在")
    }
    if (order.status !== "SUCCESS") {
      throw new Error("仅支付成功的订单可以退款")
    }
    if (input.refundAmount > order.amount) {
      throw new Error("退款金额不能超过支付金额")
    }

    const id = `pay-refund-${Date.now()}`
    const refund: PayRefund = {
      id,
      payOrderId: input.payOrderId,
      refundAmount: input.refundAmount,
      reason: input.reason,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    }
    MOCK_PAY_REFUNDS.push(refund)

    order.status = "REFUNDING"

    domainLog.event("pay.refund.create", {
      refundId: id,
      payOrderId: input.payOrderId,
      refundAmount: input.refundAmount,
    })
    domainLog.audit("pay.refund.create", {
      targetType: "PAY_REFUND",
      targetId: id,
      payOrderId: input.payOrderId,
      refundAmount: input.refundAmount,
      reason: input.reason,
    })

    return refund
  }
}

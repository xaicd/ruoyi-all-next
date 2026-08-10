/**
 * Pay Order Service - 支付订单
 */

import { PayOrderRepository } from "@/modules/pay/backend/repositories/order.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class PayOrderService {
  static async list(input: any) {
    const result = await PayOrderRepository.findList(input)
    domainLog.event("pay.order.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const order = await PayOrderRepository.findById(id)
    if (!order) throw new Error(`支付订单不存在: ${id}`)
    return order
  }
}

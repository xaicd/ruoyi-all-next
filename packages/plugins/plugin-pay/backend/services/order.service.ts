// 订单服务（手写面）。生命周期与状态守卫在 ./pay-order-lifecycle —— 那是手写资产，
// 不放进生成产物里（生成产物会被重生成覆盖）。
import { applyPaidCallback, applyClosedCallback, shouldExpire, type PayOrderLike, type PayOrderExtensionLike } from "./pay-order-lifecycle"

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

  /** 支付成功回调：幂等，返回是否应发业务事件 */
  static applyPaid(order: PayOrderLike, extension: PayOrderExtensionLike) {
    return applyPaidCallback(order, extension)
  }

  /** 支付关闭回调：已支付不降级、已关闭跳过 */
  static applyClosed(order: PayOrderLike, extension: PayOrderExtensionLike) {
    return applyClosedCallback(order, extension)
  }

  /** 是否应超时关单 */
  static shouldExpire(order: PayOrderLike, createdAt: string | Date, expireMinutes: number) {
    return shouldExpire(order, createdAt, expireMinutes)
  }
}

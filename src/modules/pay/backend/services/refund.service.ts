/**
 * Pay Refund Service - 退款单
 */

import { PayRefundRepository } from "@/modules/pay/backend/repositories/refund.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class PayRefundService {
  static async list(input: { page: number; pageSize: number; keyword?: string; status?: string }) {
    const result = await PayRefundRepository.findList(input)
    domainLog.event("pay.refund.list", { page: input.page, total: result.total })
    return result
  }

  static async getById(id: string) {
    const refund = await PayRefundRepository.findById(id)
    if (!refund) throw new Error(`退款单不存在: ${id}`)
    return refund
  }
}

import { aigwQuotaRepository } from "../repositories/aigw-quota.repository"
import { aigwLedgerService } from "./aigw-ledger.service"

export class AigwQuotaService {
  async getPage(tenantId: string, page = 1, pageSize = 20, enterpriseId?: string) {
    return aigwQuotaRepository.findPage(tenantId, page, pageSize, enterpriseId)
  }

  async recordQuotaDelta(input: {
    tenantId: string
    changeType: "PACKAGE_REFRESH" | "SKU_RECHARGE" | "USAGE_DEDUCT" | "ADMIN_ADJUST" | "CONTRACT_FRAMEWORK_GRANT"
    deltaTokens: number
    balanceAfter: number
    modelPattern?: string
    refId?: string
    operatorId?: string
    remark?: string
  }) {
    return aigwLedgerService.recordQuotaChange(input)
  }
}

export const aigwQuotaService = new AigwQuotaService()

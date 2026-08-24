import { aigwQuotaLedgerRepository, type AigwQuotaLedgerRecord } from "../repositories/aigw-ledger.repository"

export class AigwLedgerService {
  async recordQuotaChange(input: {
    tenantId: string
    changeType: AigwQuotaLedgerRecord["changeType"]
    deltaTokens: number
    balanceAfter: number
    modelPattern?: string
    refId?: string
    operatorId?: string
    remark?: string
  }): Promise<AigwQuotaLedgerRecord> {
    return aigwQuotaLedgerRepository.recordChange(input)
  }

  async queryTenantLedgerHistory(tenantId: string, page = 1, pageSize = 20): Promise<{ items: AigwQuotaLedgerRecord[]; total: number }> {
    return aigwQuotaLedgerRepository.queryHistory(tenantId, page, pageSize)
  }
}

export const aigwLedgerService = new AigwLedgerService()

import { aigwSettlementRepository } from "../repositories/aigw-settlement.repository"

export class AigwSettlementService {
  async getPage(tenantId: string, page = 1, pageSize = 20) {
    return aigwSettlementRepository.findPage(tenantId, page, pageSize)
  }
}

export const aigwSettlementService = new AigwSettlementService()

import { aigwTariffRepository } from "../repositories/aigw-tariff.repository"

export class AigwTariffService {
  async getPage(tenantId: string, page = 1, pageSize = 20) {
    return aigwTariffRepository.findPage(tenantId, page, pageSize)
  }
}

export const aigwTariffService = new AigwTariffService()

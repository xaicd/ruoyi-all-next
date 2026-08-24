import { aigwSeatRepository } from "../repositories/aigw-seat.repository"

export class AigwSeatService {
  async getPage(tenantId: string, page = 1, pageSize = 20, enterpriseId?: string) {
    return aigwSeatRepository.findPage(tenantId, page, pageSize, enterpriseId)
  }

  async create(tenantId: string, data: any) {
    return aigwSeatRepository.create(tenantId, {
      ...data,
      status: "ACTIVE",
    })
  }
}

export const aigwSeatService = new AigwSeatService()

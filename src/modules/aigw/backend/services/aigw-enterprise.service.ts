import { aigwEnterpriseRepository } from "../repositories/aigw-enterprise.repository"

export class AigwEnterpriseService {
  async getPage(tenantId: string, page = 1, pageSize = 20, keyword?: string) {
    return aigwEnterpriseRepository.findPage(tenantId, page, pageSize, keyword)
  }

  async getById(tenantId: string, id: string) {
    return aigwEnterpriseRepository.findById(tenantId, id)
  }

  async create(tenantId: string, data: any) {
    return aigwEnterpriseRepository.create(tenantId, {
      ...data,
      status: "ACTIVE",
    })
  }
}

export const aigwEnterpriseService = new AigwEnterpriseService()

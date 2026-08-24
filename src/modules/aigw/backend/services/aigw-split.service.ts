import { aigwSplitRepository } from "../repositories/aigw-split.repository"

export class AigwSplitService {
  async getPage(tenantId: string, page = 1, pageSize = 20) {
    return aigwSplitRepository.findPage(tenantId, page, pageSize)
  }
}

export const aigwSplitService = new AigwSplitService()

import { InfraPageRepository } from "@/modules/infra/backend/repositories/page.repository"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"

export class InfraPageService {
  static async listPages(input: { status?: string } = {}) {
    const data = await InfraPageRepository.findAll(input)
    domainLog.event("infra.page.list", { total: data.length, status: input.status })
    return data
  }

  static async getPage(input: { id: string }) {
    return InfraPageRepository.findById(input.id)
  }

  static async getPageBySlug(input: { slug: string }) {
    return InfraPageRepository.findBySlug(input.slug)
  }
}

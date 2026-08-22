import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { SystemNotifyTemplateRepository } from "@/modules/system/backend/repositories/notify-template.repository"

export class NotifyTemplateService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    const result = await SystemNotifyTemplateRepository.page({ page: input.page ?? 1, pageSize: input.pageSize ?? 20, keyword: input.keyword })
    domainLog.event("system.notifyTemplate.page", { total: result.total })
    return result
  }

  static async get(id: string) {
    return SystemNotifyTemplateRepository.findById(id)
  }

  static async create(input: { code: string; name: string; channel?: string; content?: string; params?: string[] }) {
    const row = await SystemNotifyTemplateRepository.create(input)
    domainLog.event("system.notifyTemplate.create", { id: row.id })
    return { id: row.id }
  }

  static async update(input: { id: string; code?: string; name?: string; channel?: string; content?: string; params?: string[]; status?: string }) {
    const { id, ...data } = input
    await SystemNotifyTemplateRepository.update(id, data)
    return { id }
  }

  static async delete(id: string) {
    await SystemNotifyTemplateRepository.delete(id)
    return { success: true }
  }
}

export { NotifyTemplateService as SystemNotifyTemplateService }

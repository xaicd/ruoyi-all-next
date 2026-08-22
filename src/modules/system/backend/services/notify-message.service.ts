import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { SystemNotifyMessageRepository } from "@/modules/system/backend/repositories/notify-message.repository"
import { SystemNotifyTemplateRepository } from "@/modules/system/backend/repositories/notify-template.repository"

export class NotifyMessageService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    const result = await SystemNotifyMessageRepository.page({ page: input.page ?? 1, pageSize: input.pageSize ?? 20, keyword: input.keyword })
    domainLog.event("system.notifyMessage.page", { total: result.total })
    return result
  }

  static async get(id: string) {
    return SystemNotifyMessageRepository.findById(id)
  }

  static async create(input: { templateCode: string; receiver: string; content?: string }) {
    const template = await SystemNotifyTemplateRepository.findByCode(input.templateCode)
    const row = await SystemNotifyMessageRepository.create({
      templateCode: input.templateCode,
      templateName: template?.name ?? input.templateCode,
      channel: template?.channel ?? "SITE",
      receiver: input.receiver,
      content: input.content ?? "",
    })
    domainLog.event("system.notifyMessage.create", { id: row.id })
    return { id: row.id }
  }

  static async delete(id: string) {
    await SystemNotifyMessageRepository.delete(id)
    return { success: true }
  }
}

export { NotifyMessageService as SystemNotifyMessageService }

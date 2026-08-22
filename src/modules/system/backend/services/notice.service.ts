import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { SystemNoticeRepository } from "@/modules/system/backend/repositories/notice.repository"

export class NoticeService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    const result = await SystemNoticeRepository.page({ page: input.page ?? 1, pageSize: input.pageSize ?? 20, keyword: input.keyword })
    domainLog.event("system.notice.page", { total: result.total })
    return result
  }

  static async get(id: string) {
    const item = await SystemNoticeRepository.findById(id)
    if (!item) throw new Error("通知不存在")
    return item
  }

  static async create(input: { title: string; content: string; type?: string }) {
    const row = await SystemNoticeRepository.create(input)
    domainLog.event("system.notice.create", { id: row.id })
    domainLog.audit("system.notice.create", { targetType: "NOTICE", targetId: row.id })
    return { id: row.id }
  }

  static async update(input: { id: string; title?: string; content?: string; type?: string; status?: string }) {
    const { id, ...data } = input
    await SystemNoticeRepository.update(id, data)
    domainLog.event("system.notice.update", { id })
    return { id }
  }

  static async delete(id: string) {
    await SystemNoticeRepository.delete(id)
    domainLog.event("system.notice.delete", { id })
    return { success: true }
  }

  static async getNotice(input: { id: string }) { return this.get(input.id) }
  static async createNotice(input: { title: string; content: string; type?: string }) { return this.create(input) }
  static async updateNotice(input: { id: string; title?: string; content?: string; type?: string; status?: string }) { return this.update(input) }
  static async deleteNotice(input: { id: string }) { return this.delete(input.id) }
}

export { NoticeService as SystemNoticeService }

import type { CreateNoticeInput, PageQueryInput } from "@/modules/system/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

type NoticeItem = {
  id: string
  title: string
  content: string
  type: "INFO" | "WARN" | "ALERT"
  status: "PUBLISHED" | "DRAFT"
}

const SETTING_KEY = "system.notice.items"

function parseItems(value: unknown): NoticeItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is NoticeItem => Boolean(item && typeof item === "object")) as NoticeItem[]
}

export class SystemNoticeService {
  static async list(input: PageQueryInput) {
    domainLog.event("system.notice.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const setting = await ruoyiPrisma.setting.findUnique({ where: { key: SETTING_KEY } })
    const items = parseItems(setting?.value)
    const keyword = input.keyword?.trim().toLowerCase() ?? ""
    const filtered = keyword
      ? items.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword) ||
            item.content.toLowerCase().includes(keyword),
        )
      : items

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async create(operatorId: string, input: CreateNoticeInput) {
    const setting = await ruoyiPrisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: {},
      create: { key: SETTING_KEY, value: [] },
    })

    const items = parseItems(setting.value)
    const created: NoticeItem = {
      id: `notice-${Date.now()}`,
      title: input.title,
      content: input.content,
      type: input.type,
      status: "PUBLISHED",
    }
    const nextItems = [created, ...items]

    await ruoyiPrisma.setting.update({
      where: { key: SETTING_KEY },
      data: { value: nextItems },
    })

    domainLog.audit("system.notice.create", {
      operatorId,
      title: input.title,
      type: input.type,
    })

    return created
  }
}

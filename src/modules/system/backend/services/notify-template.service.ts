import type { CreateNotifyTemplateInput, PageQueryInput } from "@/modules/system/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

type NotifyTemplateItem = {
  id: string
  code: string
  name: string
  channel: "SITE" | "SMS" | "MAIL"
  status: "ACTIVE" | "DISABLED"
}

const SETTING_KEY = "system.notify.templates"

function parseItems(value: unknown): NotifyTemplateItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is NotifyTemplateItem => Boolean(item && typeof item === "object")) as NotifyTemplateItem[]
}

export class SystemNotifyTemplateService {
  static async list(input: PageQueryInput) {
    domainLog.event("system.notify-template.list", {
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
            item.code.toLowerCase().includes(keyword) ||
            item.name.toLowerCase().includes(keyword),
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

  static async create(operatorId: string, input: CreateNotifyTemplateInput) {
    const setting = await ruoyiPrisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: {},
      create: { key: SETTING_KEY, value: [] },
    })

    const items = parseItems(setting.value)
    const created: NotifyTemplateItem = {
      id: `nt-${Date.now()}`,
      code: input.code,
      name: input.name,
      channel: input.channel,
      status: input.status,
    }
    const nextItems = [created, ...items]

    await ruoyiPrisma.setting.update({
      where: { key: SETTING_KEY },
      data: { value: nextItems },
    })

    domainLog.audit("system.notify-template.create", {
      operatorId,
      code: input.code,
      channel: input.channel,
    })

    return created
  }
}

import type { CreateNotifyMessageInput, PageQueryInput } from "../../../../backend/validators/system.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type NotifyMessageItem = {
  id: string
  templateCode: string
  receiver: string
  status: "SUCCESS" | "FAIL"
  sentAt: string
}

const SETTING_KEY = "system.notify.messages"

function parseItems(value: unknown): NotifyMessageItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is NotifyMessageItem => Boolean(item && typeof item === "object")) as NotifyMessageItem[]
}

export class SystemNotifyMessageService {
  static async list(input: PageQueryInput) {
    domainLog.event("system.notify-message.list", {
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
            item.templateCode.toLowerCase().includes(keyword) ||
            item.receiver.toLowerCase().includes(keyword),
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

  static async create(operatorId: string, input: CreateNotifyMessageInput) {
    const setting = await ruoyiPrisma.setting.upsert({
      where: { key: SETTING_KEY },
      update: {},
      create: { key: SETTING_KEY, value: [] },
    })

    const items = parseItems(setting.value)
    const created: NotifyMessageItem = {
      id: `nm-${Date.now()}`,
      templateCode: input.templateCode,
      receiver: input.receiver,
      status: input.status,
      sentAt: new Date().toISOString(),
    }
    const nextItems = [created, ...items]

    await ruoyiPrisma.setting.update({
      where: { key: SETTING_KEY },
      data: { value: nextItems },
    })

    domainLog.audit("system.notify-message.create", {
      operatorId,
      templateCode: input.templateCode,
      receiver: input.receiver,
    })

    return created
  }
}

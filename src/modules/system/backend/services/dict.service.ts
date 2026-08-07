import type { CreateDictItemInput, PageQueryInput } from "@/modules/system/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { ruoyiPrisma } from "@/modules/shared/backend/prisma"

type DictItem = {
  id: string
  dictType: string
  label: string
  value: string
  status: "ACTIVE" | "DISABLED"
}

export class SystemDictService {
  static async list(input: PageQueryInput) {
    domainLog.event("system.dict.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const row = await ruoyiPrisma.setting.findUnique({ where: { key: "system.dict-items" } })
    const items = (row?.value as { items?: DictItem[] } | null)?.items ?? []
    const filtered = keyword
      ? items.filter(
          (item) =>
            item.dictType.toLowerCase().includes(keyword) ||
            item.label.toLowerCase().includes(keyword) ||
            item.value.toLowerCase().includes(keyword),
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

  static async create(operatorId: string, input: CreateDictItemInput) {
    const row = await ruoyiPrisma.setting.findUnique({ where: { key: "system.dict-items" } })
    const current = (row?.value as { items?: DictItem[] } | null)?.items ?? []
    const created: DictItem = {
      id: `dict-${Date.now()}`,
      dictType: input.dictType,
      label: input.label,
      value: input.value,
      status: input.status,
    }
    const next = [created, ...current]
    await ruoyiPrisma.setting.upsert({
      where: { key: "system.dict-items" },
      create: { key: "system.dict-items", value: { items: next } },
      update: { value: { items: next } },
    })

    domainLog.audit("system.dict.create", {
      operatorId,
      dictType: input.dictType,
      value: input.value,
    })

    return created
  }
}

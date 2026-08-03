import type { SystemModulePageQueryInput } from "../validators"
import { domainLog } from "../../../../backend/lib/domain-log"
import { ruoyiPrisma } from "../../../shared/backend/prisma"

type AreaItem = {
  id: string
  code: string
  name: string
  level: "PROVINCE" | "CITY" | "COUNTY"
}

export class SystemIpAreaService {
  static async listAreas(input: SystemModulePageQueryInput) {
    domainLog.event("system.ip-area.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const row = await ruoyiPrisma.setting.findUnique({ where: { key: "system.ip-areas" } })
    const areas = (row?.value as { items?: AreaItem[] } | null)?.items ?? []
    const filtered = keyword
      ? areas.filter(
          (item) =>
            item.code.toLowerCase().includes(keyword) ||
            item.name.toLowerCase().includes(keyword) ||
            item.level.toLowerCase().includes(keyword),
        )
      : areas

    const start = (input.page - 1) * input.pageSize
    return {
      items: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }
}

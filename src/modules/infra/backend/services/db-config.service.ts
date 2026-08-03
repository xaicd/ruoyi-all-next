import type { InfraPageQueryInput } from "../../../../backend/validators/infra.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { readSettingList } from "./infra-setting-store"

type InfraDbConfigItem = {
  id: string
  name: string
  host: string
  port: number
  dbName: string
  enabled: boolean
  updatedAt: string
}

export class InfraDbConfigService {
  static async list(input: InfraPageQueryInput) {
    domainLog.event("infra.db-config.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const configs = await readSettingList<InfraDbConfigItem>("infra.db-configs")
    const filtered = keyword
      ? configs.filter(
          (item) =>
            item.name.toLowerCase().includes(keyword) ||
            item.host.toLowerCase().includes(keyword) ||
            item.dbName.toLowerCase().includes(keyword),
        )
      : configs

    const start = (input.page - 1) * input.pageSize
    const items = filtered.slice(start, start + input.pageSize)
    return { items, total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
}

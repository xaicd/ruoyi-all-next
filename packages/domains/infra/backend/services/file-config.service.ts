import type { InfraPageQueryInput } from "@/modules/infra/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { readSettingList } from "./infra-setting-store"

type InfraFileConfigItem = {
  id: string
  name: string
  storage: "LOCAL" | "S3"
  endpoint?: string
  bucket?: string
  isDefault: boolean
  updatedAt: string
}

export class InfraFileConfigService {
  static async list(input: InfraPageQueryInput) {
    domainLog.event("infra.file-config.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const configs = await readSettingList<InfraFileConfigItem>("infra.file-configs")
    const filtered = keyword
      ? configs.filter(
          (item) =>
            item.name.toLowerCase().includes(keyword) ||
            item.storage.toLowerCase().includes(keyword),
        )
      : configs

    const start = (input.page - 1) * input.pageSize
    const items = filtered.slice(start, start + input.pageSize)
    return { items, total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
}

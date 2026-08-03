import type {
  InfraPageQueryInput,
  UpdateConfigInput,
} from "../../../../backend/validators/infra.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { readSettingList, writeSettingList } from "./infra-setting-store"

type InfraConfigItem = {
  key: string
  value: string
  remark?: string
  updatedAt: string
}

export class InfraConfigService {
  static async list(input: InfraPageQueryInput) {
    domainLog.event("infra.config.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const configs = await readSettingList<InfraConfigItem>("infra.configs")
    const filtered = keyword
      ? configs.filter(
          (item) =>
            item.key.toLowerCase().includes(keyword) ||
            (item.remark ?? "").toLowerCase().includes(keyword),
        )
      : configs

    const start = (input.page - 1) * input.pageSize
    const items = filtered.slice(start, start + input.pageSize)
    return { items, total: filtered.length, page: input.page, pageSize: input.pageSize }
  }

  static async save(input: UpdateConfigInput) {
    domainLog.event("infra.config.save", { key: input.key })
    const configs = await readSettingList<InfraConfigItem>("infra.configs")
    const payload = {
      key: input.key,
      value: input.value,
      remark: input.remark,
      updatedAt: new Date().toISOString(),
    }
    const next = configs.filter((item) => item.key !== input.key)
    next.push(payload)
    await writeSettingList("infra.configs", next)
    domainLog.audit("infra.config.update", {
      targetType: "CONFIG",
      targetId: input.key,
    })
    return payload
  }
}

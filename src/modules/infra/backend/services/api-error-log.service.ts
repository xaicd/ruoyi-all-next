import type { InfraPageQueryInput } from "../../../../backend/validators/infra.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { readSettingList } from "./infra-setting-store"

type InfraApiErrorLogItem = {
  id: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  statusCode: number
  errorMessage: string
  createdAt: string
}

export class InfraApiErrorLogService {
  static async list(input: InfraPageQueryInput) {
    domainLog.event("infra.api-error-log.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const logs = await readSettingList<InfraApiErrorLogItem>("infra.api-error-logs")
    const filtered = keyword
      ? logs.filter(
          (item) =>
            item.path.toLowerCase().includes(keyword) ||
            item.method.toLowerCase().includes(keyword) ||
            item.errorMessage.toLowerCase().includes(keyword),
        )
      : logs

    const start = (input.page - 1) * input.pageSize
    const items = filtered.slice(start, start + input.pageSize)
    return { items, total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
}

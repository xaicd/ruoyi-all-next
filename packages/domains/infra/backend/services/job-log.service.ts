import type { InfraPageQueryInput } from "@/modules/infra/backend/validators"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { readSettingList } from "./infra-setting-store"

type InfraJobLogItem = {
  id: string
  jobId: string
  jobName: string
  status: "SUCCESS" | "FAILED"
  durationMs: number
  startedAt: string
  endedAt: string
}

export class InfraJobLogService {
  static async list(input: InfraPageQueryInput) {
    domainLog.event("infra.job-log.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const logs = await readSettingList<InfraJobLogItem>("infra.job-logs")
    const filtered = keyword
      ? logs.filter(
          (item) =>
            item.jobId.toLowerCase().includes(keyword) ||
            item.jobName.toLowerCase().includes(keyword) ||
            item.status.toLowerCase().includes(keyword),
        )
      : logs

    const start = (input.page - 1) * input.pageSize
    const items = filtered.slice(start, start + input.pageSize)
    return { items, total: filtered.length, page: input.page, pageSize: input.pageSize }
  }
}

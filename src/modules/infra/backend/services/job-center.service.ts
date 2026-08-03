import type {
  InfraPageQueryInput,
  TriggerJobInput,
} from "../../../../backend/validators/infra.validator"
import { domainLog } from "../../../../backend/lib/domain-log"
import { readSettingList, writeSettingList } from "./infra-setting-store"

type InfraJobItem = {
  id: string
  name: string
  cron: string
  status: "RUNNING" | "PAUSED"
  updatedAt: string
}

export class InfraJobCenterService {
  static async list(input: InfraPageQueryInput) {
    domainLog.event("infra.job.list", {
      page: input.page,
      pageSize: input.pageSize,
      hasKeyword: Boolean(input.keyword),
    })

    const keyword = input.keyword?.toLowerCase() ?? ""
    const jobs = await readSettingList<InfraJobItem>("infra.jobs")
    const filtered = keyword
      ? jobs.filter((item) => item.name.toLowerCase().includes(keyword))
      : jobs

    const start = (input.page - 1) * input.pageSize
    const items = filtered.slice(start, start + input.pageSize)
    return { items, total: filtered.length, page: input.page, pageSize: input.pageSize }
  }

  static async trigger(input: TriggerJobInput) {
    domainLog.event("infra.job.trigger", { jobId: input.jobId, action: input.action })
    const jobs = await readSettingList<InfraJobItem>("infra.jobs")
    const target = jobs.find((item) => item.id === input.jobId)
    if (!target) throw new Error("任务不存在")

    const next = jobs.map((item) =>
      item.id === input.jobId
        ? {
            ...item,
            status: input.action === "pause" ? "PAUSED" : "RUNNING",
            updatedAt: new Date().toISOString(),
          }
        : item,
    )

    await writeSettingList("infra.jobs", next)
    domainLog.audit("infra.job.operate", {
      targetType: "JOB",
      targetId: target.id,
      action: input.action,
    })
    return { ...target, status: input.action === "pause" ? "PAUSED" : "RUNNING", action: input.action }
  }
}

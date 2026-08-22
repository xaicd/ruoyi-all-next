import { purgeExpiredAdminSessions } from "@/modules/shared/backend/auth/session-registry"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { InfraJobRepository, type InfraJobRow } from "@/modules/infra/backend/repositories/job.repository"
import { InfraJobLogRepository } from "@/modules/infra/backend/repositories/job-log.repository"
import { cronMatches } from "./cron-match"

type JobHandler = (param: string | null) => Promise<string>

const handlers: Record<string, JobHandler> = {
  sessionCleanupHandler: async () => {
    purgeExpiredAdminSessions()
    return "purged expired admin sessions"
  },
  dataBackupHandler: async (param) => `backup skipped in-process${param ? ` (${param})` : ""}`,
  logArchiveHandler: async () => "log archive skipped in-process",
}

const lastFiredMinute = new Map<string, string>()

function minuteKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`
}

export async function executeJob(job: InfraJobRow): Promise<{ status: "SUCCESS" | "FAIL"; result: string }> {
  const begin = new Date()
  const handler = handlers[job.handlerName]
  try {
    if (!handler) throw new Error(`未注册的任务处理器: ${job.handlerName}`)
    const result = await handler(job.handlerParam)
    const end = new Date()
    await InfraJobLogRepository.create({
      jobId: job.id, handlerName: job.handlerName, beginTime: begin.toISOString(), endTime: end.toISOString(),
      duration: end.getTime() - begin.getTime(), status: "SUCCESS", result,
    })
    domainLog.event("infra.job.execute", { jobId: job.id, handler: job.handlerName, status: "SUCCESS" })
    return { status: "SUCCESS", result }
  } catch (error) {
    const end = new Date()
    const result = error instanceof Error ? error.message : "任务执行失败"
    await InfraJobLogRepository.create({
      jobId: job.id, handlerName: job.handlerName, beginTime: begin.toISOString(), endTime: end.toISOString(),
      duration: end.getTime() - begin.getTime(), status: "FAIL", result,
    })
    domainLog.event("infra.job.execute", { jobId: job.id, handler: job.handlerName, status: "FAIL" })
    return { status: "FAIL", result }
  }
}

export async function runDueJobs(now = new Date()) {
  const page = await InfraJobRepository.findList({ page: 1, pageSize: 200, status: "ACTIVE" })
  const fired: string[] = []
  for (const job of page.items) {
    if (!cronMatches(job.cronExpression, now)) continue
    const key = minuteKey(now)
    if (lastFiredMinute.get(job.id) === key) continue
    lastFiredMinute.set(job.id, key)
    await executeJob(job)
    fired.push(job.id)
  }
  return fired
}

export function resetJobRuntime() {
  lastFiredMinute.clear()
}

let scheduler: ReturnType<typeof setInterval> | undefined

export function startJobScheduler() {
  if (scheduler || process.env.INFRA_JOB_SCHEDULER === "off") return
  scheduler = setInterval(() => { void runDueJobs() }, 30_000)
  scheduler.unref?.()
}

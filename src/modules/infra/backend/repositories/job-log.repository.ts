import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type InfraJobLogRow = {
  id: string
  jobId: string
  handlerName: string
  beginTime: string
  endTime: string | null
  duration: number
  status: string
  result: string | null
  createdAt: string
}

const MEMORY_STORE: InfraJobLogRow[] = []

function mapRow(row: { id: string; job_id: string; handler_name: string; begin_time: Date | string; end_time: Date | string | null; duration: number; status: string; result: string | null; created_at: Date | string }): InfraJobLogRow {
  const iso = (value: Date | string | null) => (value instanceof Date ? value.toISOString() : value)
  return { id: row.id, jobId: row.job_id, handlerName: row.handler_name, beginTime: iso(row.begin_time)!, endTime: iso(row.end_time), duration: row.duration, status: row.status, result: row.result, createdAt: iso(row.created_at)! }
}

export const InfraJobLogRepository = {
  async page(params: { page: number; pageSize: number; keyword?: string; jobId?: string }): Promise<PageResult<InfraJobLogRow>> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db.selectFrom("infra_job_log")
      if (params.jobId) query = query.where("job_id", "=", params.jobId)
      if (params.keyword) query = query.where("handler_name", "like", `%${params.keyword}%`)
      const total = Number((await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst())?.count ?? 0)
      const rows = await query.selectAll().orderBy("created_at", "desc").offset((params.page - 1) * params.pageSize).limit(params.pageSize).execute()
      return { items: rows.map(mapRow), total, page: params.page, pageSize: params.pageSize }
    }
    const filtered = MEMORY_STORE.filter((row) => (!params.jobId || row.jobId === params.jobId) && (!params.keyword || row.handlerName.toLowerCase().includes(params.keyword.toLowerCase())))
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total: filtered.length, page: params.page, pageSize: params.pageSize }
  },

  async create(data: Omit<InfraJobLogRow, "id" | "createdAt">): Promise<InfraJobLogRow> {
    const now = new Date()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      const row = await db.insertInto("infra_job_log").values({
        id: randomUUID(),
        job_id: data.jobId,
        handler_name: data.handlerName,
        begin_time: new Date(data.beginTime),
        end_time: data.endTime ? new Date(data.endTime) : null,
        duration: data.duration,
        status: data.status,
        result: data.result,
        created_at: now,
      }).returningAll().executeTakeFirstOrThrow()
      return mapRow(row)
    }
    const row: InfraJobLogRow = { ...data, id: randomUUID(), createdAt: now.toISOString() }
    MEMORY_STORE.unshift(row)
    return row
  },
}

export function resetJobLogMemory() {
  MEMORY_STORE.length = 0
}

/**
 * InfraJob Repository - 定时任务
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type InfraJobRow = {
  id: string
  name: string
  handlerName: string
  handlerParam: string | null
  cronExpression: string
  retryCount: number
  retryInterval: number
  status: string
  createdAt: string
  updatedAt: string
}

export type CreateJobData = { name: string; handlerName: string; handlerParam?: string; cronExpression: string; retryCount?: number; retryInterval?: number; status?: string }
export type UpdateJobData = Partial<CreateJobData>
export type JobListParams = { page: number; pageSize: number; keyword?: string; status?: string }

const MEMORY_STORE: InfraJobRow[] = [
  { id: "1", name: "用户会话清理", handlerName: "sessionCleanupHandler", handlerParam: null, cronExpression: "0 0 2 * * ?", retryCount: 3, retryInterval: 5000, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "2", name: "数据备份任务", handlerName: "dataBackupHandler", handlerParam: '{"tables":"all"}', cronExpression: "0 0 3 * * ?", retryCount: 1, retryInterval: 10000, status: "ACTIVE", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  { id: "3", name: "日志归档", handlerName: "logArchiveHandler", handlerParam: null, cronExpression: "0 30 4 * * ?", retryCount: 2, retryInterval: 5000, status: "DISABLED", createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
]
let memoryIdSeq = 100

export const InfraJobRepository = {
  async findList(params: JobListParams): Promise<PageResult<InfraJobRow>> {
    if (hasRealDatabase()) return findListFromDb(params)
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((j) => j.name.toLowerCase().includes(kw) || j.handlerName.toLowerCase().includes(kw)) }
    if (params.status) filtered = filtered.filter((j) => j.status === params.status)
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<InfraJobRow | null> {
    if (hasRealDatabase()) return findByIdFromDb(id)
    return MEMORY_STORE.find((j) => j.id === id) ?? null
  },

  async create(data: CreateJobData): Promise<InfraJobRow> {
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString()
    const row: InfraJobRow = { id: String(++memoryIdSeq), name: data.name, handlerName: data.handlerName, handlerParam: data.handlerParam ?? null, cronExpression: data.cronExpression, retryCount: data.retryCount ?? 0, retryInterval: data.retryInterval ?? 0, status: data.status ?? "ACTIVE", createdAt: now, updatedAt: now }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdateJobData): Promise<InfraJobRow> {
    if (hasRealDatabase()) return updateInDb(id, data)
    const idx = MEMORY_STORE.findIndex((j) => j.id === id)
    if (idx === -1) throw new Error(`任务不存在: ${id}`)
    const job = MEMORY_STORE[idx]
    const updated: InfraJobRow = { ...job, name: data.name ?? job.name, handlerName: data.handlerName ?? job.handlerName, handlerParam: data.handlerParam !== undefined ? (data.handlerParam ?? null) : job.handlerParam, cronExpression: data.cronExpression ?? job.cronExpression, retryCount: data.retryCount ?? job.retryCount, retryInterval: data.retryInterval ?? job.retryInterval, status: data.status ?? job.status, updatedAt: new Date().toISOString() }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    const idx = MEMORY_STORE.findIndex((j) => j.id === id)
    if (idx === -1) throw new Error(`任务不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}

// === Kysely ===
async function findListFromDb(params: JobListParams): Promise<PageResult<InfraJobRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("infra_job").where("deleted", "=", false)
  if (params.keyword) { const kw = `%${params.keyword}%`; query = query.where((eb) => eb.or([eb("name", "like", kw), eb("handler_name", "like", kw)])) }
  if (params.status) query = query.where("status", "=", params.status)
  const countResult = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  const total = Number(countResult?.count ?? 0)
  const offset = (params.page - 1) * params.pageSize
  const rows = await query.selectAll().orderBy("created_at", "desc").offset(offset).limit(params.pageSize).execute()
  return { items: rows.map(mapRow), total, page: params.page, pageSize: params.pageSize }
}

async function findByIdFromDb(id: string): Promise<InfraJobRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("infra_job").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
  return row ? mapRow(row) : null
}

async function createInDb(data: CreateJobData): Promise<InfraJobRow> {
  const db = await getKyselyDb()
  const row = await db.insertInto("infra_job").values({ name: data.name, handler_name: data.handlerName, handler_param: data.handlerParam ?? null, cron_expression: data.cronExpression, retry_count: data.retryCount ?? 0, retry_interval: data.retryInterval ?? 0, status: data.status ?? "ACTIVE", updated_at: new Date(), deleted: false }).returningAll().executeTakeFirstOrThrow()
  return mapRow(row)
}

async function updateInDb(id: string, data: UpdateJobData): Promise<InfraJobRow> {
  const db = await getKyselyDb()
  const u: Record<string, any> = { updated_at: new Date() }
  if (data.name !== undefined) u.name = data.name
  if (data.handlerName !== undefined) u.handler_name = data.handlerName
  if (data.handlerParam !== undefined) u.handler_param = data.handlerParam
  if (data.cronExpression !== undefined) u.cron_expression = data.cronExpression
  if (data.retryCount !== undefined) u.retry_count = data.retryCount
  if (data.retryInterval !== undefined) u.retry_interval = data.retryInterval
  if (data.status !== undefined) u.status = data.status
  const row = await db.updateTable("infra_job").set(u).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirstOrThrow()
  return mapRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  await db.updateTable("infra_job").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).execute()
}

function mapRow(row: any): InfraJobRow {
  return { id: row.id, name: row.name, handlerName: row.handler_name, handlerParam: row.handler_param, cronExpression: row.cron_expression, retryCount: row.retry_count, retryInterval: row.retry_interval, status: row.status, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at), updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at) }
}

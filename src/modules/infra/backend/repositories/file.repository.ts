/**
 * InfraFile Repository - 文件管理
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"

export type InfraFileRow = {
  id: string
  configId: string
  name: string | null
  path: string
  url: string
  type: string | null
  size: number
  createdAt: string
}

export type CreateFileData = { configId: string; name?: string; path: string; url: string; type?: string; size: number }
export type FileListParams = { page: number; pageSize: number; keyword?: string; type?: string }

// === 内存存储 ===
const MEMORY_STORE: InfraFileRow[] = [
  { id: "1", configId: "1", name: "logo.png", path: "/uploads/2026/01/logo.png", url: "/uploads/2026/01/logo.png", type: "image/png", size: 12480, createdAt: "2026-01-15T08:00:00.000Z" },
  { id: "2", configId: "1", name: "report-2026Q1.pdf", path: "/uploads/2026/03/report.pdf", url: "/uploads/2026/03/report.pdf", type: "application/pdf", size: 245760, createdAt: "2026-03-20T10:30:00.000Z" },
]
let memoryIdSeq = 100

export const InfraFileRepository = {
  async findList(params: FileListParams): Promise<PageResult<InfraFileRow>> {
    if (hasRealDatabase()) return findListFromDb(params)
    let filtered = [...MEMORY_STORE]
    if (params.keyword) { const kw = params.keyword.toLowerCase(); filtered = filtered.filter((f) => (f.name ?? "").toLowerCase().includes(kw) || f.path.toLowerCase().includes(kw)) }
    if (params.type) filtered = filtered.filter((f) => (f.type ?? "").includes(params.type!))
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const total = filtered.length
    const start = (params.page - 1) * params.pageSize
    return { items: filtered.slice(start, start + params.pageSize), total, page: params.page, pageSize: params.pageSize }
  },

  async findById(id: string): Promise<InfraFileRow | null> {
    if (hasRealDatabase()) return findByIdFromDb(id)
    return MEMORY_STORE.find((f) => f.id === id) ?? null
  },

  async create(data: CreateFileData): Promise<InfraFileRow> {
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString()
    const row: InfraFileRow = { id: String(++memoryIdSeq), configId: data.configId, name: data.name ?? null, path: data.path, url: data.url, type: data.type ?? null, size: data.size, createdAt: now }
    MEMORY_STORE.push(row)
    return row
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    const idx = MEMORY_STORE.findIndex((f) => f.id === id)
    if (idx === -1) throw new Error(`文件不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}

// === Kysely ===
async function findListFromDb(params: FileListParams): Promise<PageResult<InfraFileRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("infra_file")
  if (params.keyword) { const kw = `%${params.keyword}%`; query = query.where((eb) => eb.or([eb("name", "like", kw), eb("path", "like", kw)])) }
  if (params.type) query = query.where("type", "like", `%${params.type}%`)
  const countResult = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  const total = Number(countResult?.count ?? 0)
  const offset = (params.page - 1) * params.pageSize
  const rows = await query.selectAll().orderBy("created_at", "desc").offset(offset).limit(params.pageSize).execute()
  return { items: rows.map(mapRow), total, page: params.page, pageSize: params.pageSize }
}

async function findByIdFromDb(id: string): Promise<InfraFileRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("infra_file").selectAll().where("id", "=", id).executeTakeFirst()
  return row ? mapRow(row) : null
}

async function createInDb(data: CreateFileData): Promise<InfraFileRow> {
  const db = await getKyselyDb()
  const row = await db.insertInto("infra_file").values({ config_id: data.configId, name: data.name ?? null, path: data.path, url: data.url, type: data.type ?? null, size: data.size } as any).returningAll().executeTakeFirstOrThrow()
  return mapRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  await db.deleteFrom("infra_file").where("id", "=", id).execute()
}

function mapRow(row: any): InfraFileRow {
  return { id: row.id, configId: row.config_id, name: row.name, path: row.path, url: row.url, type: row.type, size: row.size, createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at) }
}

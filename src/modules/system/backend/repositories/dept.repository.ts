/**
 * SystemDept Repository - 树形结构
 */

import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import { SEED_DEPTS } from "@prisma/data"

export type SystemDeptRow = {
  id: string
  name: string
  parentId: string | null
  sort: number
  leaderId: string | null
  phone: string | null
  email: string | null
  status: string
  tenantId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateDeptData = {
  name: string
  parentId?: string
  sort?: number
  leaderId?: string
  phone?: string
  email?: string
  status?: string
}

export type UpdateDeptData = Partial<CreateDeptData>

// === 内存存储（对标 ruoyi-vue-pro 种子数据） ===
const MEMORY_STORE: SystemDeptRow[] = [...SEED_DEPTS]

let memoryIdSeq = 200

export const SystemDeptRepository = {
  /** 获取全部部门列表（树形场景需要全量） */
  async findAll(params?: { status?: string; keyword?: string }): Promise<SystemDeptRow[]> {
    if (hasRealDatabase()) return findAllFromDb(params)
    let filtered = [...MEMORY_STORE]
    if (params?.status) filtered = filtered.filter((d) => d.status === params.status)
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(kw))
    }
    return filtered.sort((a, b) => a.sort - b.sort)
  },

  async findById(id: string): Promise<SystemDeptRow | null> {
    if (hasRealDatabase()) return findByIdFromDb(id)
    return MEMORY_STORE.find((d) => d.id === id) ?? null
  },

  async create(data: CreateDeptData): Promise<SystemDeptRow> {
    if (hasRealDatabase()) return createInDb(data)
    const now = new Date().toISOString()
    const row: SystemDeptRow = {
      id: String(++memoryIdSeq),
      name: data.name,
      parentId: data.parentId ?? null,
      sort: data.sort ?? 0,
      leaderId: data.leaderId ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      status: data.status ?? "ACTIVE",
      tenantId: null,
      createdAt: now,
      updatedAt: now,
    }
    MEMORY_STORE.push(row)
    return row
  },

  async update(id: string, data: UpdateDeptData): Promise<SystemDeptRow> {
    if (hasRealDatabase()) return updateInDb(id, data)
    const idx = MEMORY_STORE.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error(`部门不存在: ${id}`)
    const dept = MEMORY_STORE[idx]
    const updated: SystemDeptRow = {
      ...dept,
      name: data.name ?? dept.name,
      parentId: data.parentId !== undefined ? (data.parentId ?? null) : dept.parentId,
      sort: data.sort ?? dept.sort,
      leaderId: data.leaderId !== undefined ? (data.leaderId ?? null) : dept.leaderId,
      phone: data.phone !== undefined ? (data.phone ?? null) : dept.phone,
      email: data.email !== undefined ? (data.email ?? null) : dept.email,
      status: data.status ?? dept.status,
      updatedAt: new Date().toISOString(),
    }
    MEMORY_STORE[idx] = updated
    return updated
  },

  async delete(id: string): Promise<void> {
    if (hasRealDatabase()) return deleteInDb(id)
    // 检查是否有子部门
    const hasChildren = MEMORY_STORE.some((d) => d.parentId === id)
    if (hasChildren) throw new Error("该部门下存在子部门，无法删除")
    const idx = MEMORY_STORE.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error(`部门不存在: ${id}`)
    MEMORY_STORE.splice(idx, 1)
  },
}

// === Kysely 实现 ===

async function findAllFromDb(params?: { status?: string; keyword?: string }): Promise<SystemDeptRow[]> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_dept").where("deleted", "=", false)
  if (params?.status) query = query.where("status", "=", params.status)
  if (params?.keyword) query = query.where("name", "like", `%${params.keyword}%`)
  const rows = await query.selectAll().orderBy("sort", "asc").execute()
  return rows.map(mapDbRow)
}

async function findByIdFromDb(id: string): Promise<SystemDeptRow | null> {
  const db = await getKyselyDb()
  const row = await db.selectFrom("system_dept").selectAll().where("id", "=", id).where("deleted", "=", false).executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function createInDb(data: CreateDeptData): Promise<SystemDeptRow> {
  const db = await getKyselyDb()
  const row = await db.insertInto("system_dept").values({
    name: data.name,
    parent_id: data.parentId ?? null,
    sort: data.sort ?? 0,
    leader_id: data.leaderId ?? null,
    phone: data.phone ?? null,
    email: data.email ?? null,
    status: data.status ?? "ACTIVE",
    tenant_id: null,
    updated_at: new Date(),
    deleted: false,
  }).returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function updateInDb(id: string, data: UpdateDeptData): Promise<SystemDeptRow> {
  const db = await getKyselyDb()
  const updateData: Record<string, any> = { updated_at: new Date() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.parentId !== undefined) updateData.parent_id = data.parentId
  if (data.sort !== undefined) updateData.sort = data.sort
  if (data.leaderId !== undefined) updateData.leader_id = data.leaderId
  if (data.phone !== undefined) updateData.phone = data.phone
  if (data.email !== undefined) updateData.email = data.email
  if (data.status !== undefined) updateData.status = data.status

  const row = await db.updateTable("system_dept").set(updateData).where("id", "=", id).where("deleted", "=", false).returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function deleteInDb(id: string): Promise<void> {
  const db = await getKyselyDb()
  // 检查子部门
  const children = await db.selectFrom("system_dept").select("id").where("parent_id", "=", id).where("deleted", "=", false).execute()
  if (children.length > 0) throw new Error("该部门下存在子部门，无法删除")
  await db.updateTable("system_dept").set({ deleted: true, updated_at: new Date() }).where("id", "=", id).execute()
}

function mapDbRow(row: any): SystemDeptRow {
  return {
    id: row.id,
    name: row.name,
    parentId: row.parent_id,
    sort: row.sort,
    leaderId: row.leader_id,
    phone: row.phone,
    email: row.email,
    status: row.status,
    tenantId: row.tenant_id,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  }
}

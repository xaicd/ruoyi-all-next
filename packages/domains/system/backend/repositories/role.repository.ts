/**
 * SystemRole Repository
 * 双模式：真实 DB (Kysely) / 内存存储
 */

import { randomUUID } from "node:crypto"
import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import type { PageResult } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId, isPlatformContext, isTenantRequired } from "@/modules/shared/backend/lib/biz-tenant"
import type { SystemRoleRow, CreateRoleData, UpdateRoleData, RoleListParams } from "./role.types"
import {
  findRoleListFromMemory,
  findRoleByIdFromMemory,
  findRoleByCodeFromMemory,
  createRoleInMemory,
  updateRoleInMemory,
  deleteRoleInMemory,
} from "./role-memory.store"

export type { SystemRoleRow, CreateRoleData, UpdateRoleData, RoleListParams } from "./role.types"

function currentTenantId(): string | undefined {
  if (isPlatformContext()) return undefined
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired()) throw new Error("角色数据访问缺少租户上下文")
  return undefined
}

export const SystemRoleRepository = {
  async findList(params: RoleListParams): Promise<PageResult<SystemRoleRow>> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return findListFromDb(params, tenantId)
    return findRoleListFromMemory(params, tenantId)
  },

  async findById(id: string): Promise<SystemRoleRow | null> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return findByIdFromDb(id, tenantId)
    return findRoleByIdFromMemory(id, tenantId)
  },

  async findByCode(code: string): Promise<SystemRoleRow | null> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return findByCodeFromDb(code, tenantId)
    return findRoleByCodeFromMemory(code, tenantId)
  },

  async create(data: CreateRoleData): Promise<SystemRoleRow> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return createInDb(data, tenantId)
    return createRoleInMemory(data, tenantId)
  },

  async update(id: string, data: UpdateRoleData): Promise<SystemRoleRow> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return updateInDb(id, data, tenantId)
    return updateRoleInMemory(id, data, tenantId)
  },

  async delete(id: string): Promise<void> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) return deleteInDb(id, tenantId)
    return deleteRoleInMemory(id, tenantId)
  },
}

// === Kysely DB 实现 ===

async function findListFromDb(params: RoleListParams, tenantId?: string): Promise<PageResult<SystemRoleRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_role").where("deleted", "=", false)

  if (params.keyword) {
    const kw = `%${params.keyword}%`
    query = query.where((eb) => eb.or([eb("name", "like", kw), eb("code", "like", kw)]))
  }
  if (params.status) query = query.where("status", "=", params.status)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)

  const countResult = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  const total = Number(countResult?.count ?? 0)

  const offset = (params.page - 1) * params.pageSize
  const rows = await query.selectAll().orderBy("sort", "asc").offset(offset).limit(params.pageSize).execute()

  return { items: rows.map(mapDbRow), total, page: params.page, pageSize: params.pageSize }
}

async function findByIdFromDb(id: string, tenantId?: string): Promise<SystemRoleRow | null> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_role").selectAll().where("id", "=", id).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function findByCodeFromDb(code: string, tenantId?: string): Promise<SystemRoleRow | null> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_role").selectAll().where("code", "=", code).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.executeTakeFirst()
  return row ? mapDbRow(row) : null
}

async function createInDb(data: CreateRoleData, tenantId?: string): Promise<SystemRoleRow> {
  const db = await getKyselyDb()
  const row = await db.insertInto("system_role").values({
    id: (data as any).id ?? randomUUID(),
    name: data.name,
    code: data.code,
    sort: data.sort ?? 0,
    status: data.status ?? "ACTIVE",
    data_scope: data.dataScope ?? "ALL",
    remark: data.remark ?? null,
    tenant_id: tenantId ?? null,
    updated_at: new Date(),
    deleted: false,
  } as any).returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function updateInDb(id: string, data: UpdateRoleData, tenantId?: string): Promise<SystemRoleRow> {
  const db = await getKyselyDb()
  const updateData: Record<string, any> = { updated_at: new Date() }
  if (data.name !== undefined) updateData.name = data.name
  if (data.code !== undefined) updateData.code = data.code
  if (data.sort !== undefined) updateData.sort = data.sort
  if (data.status !== undefined) updateData.status = data.status
  if (data.dataScope !== undefined) updateData.data_scope = data.dataScope
  if (data.remark !== undefined) updateData.remark = data.remark

  let query = db.updateTable("system_role").set(updateData).where("id", "=", id).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

async function deleteInDb(id: string, tenantId?: string): Promise<void> {
  const db = await getKyselyDb()
  let query = db.updateTable("system_role").set({ deleted: true, updated_at: new Date() }).where("id", "=", id)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  await query.execute()
}

function mapDbRow(row: any): SystemRoleRow {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    sort: row.sort,
    status: row.status,
    dataScope: row.data_scope,
    remark: row.remark,
    tenantId: row.tenant_id,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  }
}

export const systemRoleRepository = SystemRoleRepository

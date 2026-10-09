/**
 * SystemUser Kysely Database Queries
 */

import { randomUUID } from "node:crypto"
import { getKyselyDb, type PageResult } from "@/modules/shared/backend/lib/database"
import type { SystemUserRow, CreateUserData, UpdateUserData, UserListParams } from "./user.types"

export function mapDbRow(row: any): SystemUserRow {
  return {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    password: row.password,
    salt: row.salt,
    phone: row.phone,
    email: row.email,
    avatar: row.avatar,
    status: row.status,
    deptId: row.dept_id,
    remark: row.remark,
    tenantId: row.tenant_id,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
    updatedAt: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
  }
}

export async function findListFromDb(params: UserListParams): Promise<PageResult<SystemUserRow>> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_user").where("deleted", "=", false)

  if (params.keyword) {
    const kw = `%${params.keyword}%`
    query = query.where((eb) =>
      eb.or([
        eb("username", "like", kw),
        eb("nickname", "like", kw),
        eb("phone", "like", kw),
      ]),
    )
  }
  if (params.status) query = query.where("status", "=", params.status)
  if (params.deptId) query = query.where("dept_id", "=", params.deptId)
  if (params.tenantId) query = query.where("tenant_id", "=", params.tenantId)

  const countResult = await query
    .select((eb) => eb.fn.countAll<number>().as("count"))
    .executeTakeFirst()
  const total = Number(countResult?.count ?? 0)

  const offset = (params.page - 1) * params.pageSize
  const rows = await query
    .selectAll()
    .orderBy("created_at", "desc")
    .offset(offset)
    .limit(params.pageSize)
    .execute()

  return {
    items: rows.map(mapDbRow),
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function findByIdFromDb(id: string, tenantId?: string): Promise<SystemUserRow | null> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_user").selectAll().where("id", "=", id).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.executeTakeFirst()
  return row ? mapDbRow(row) : null
}

export async function findByUsernameFromDb(username: string, tenantId?: string): Promise<SystemUserRow | null> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_user").selectAll().where("username", "=", username).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.executeTakeFirst()
  return row ? mapDbRow(row) : null
}

export async function createInDb(data: CreateUserData): Promise<SystemUserRow> {
  const db = await getKyselyDb()
  const now = new Date()
  const row = await db
    .insertInto("system_user")
    .values({
      id: randomUUID(),
      username: data.username,
      nickname: data.nickname,
      password: data.password,
      salt: data.salt,
      phone: data.phone ?? null,
      email: data.email ?? null,
      avatar: null,
      status: data.status ?? "ACTIVE",
      dept_id: data.deptId ?? null,
      remark: data.remark ?? null,
      tenant_id: data.tenantId ?? null,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      login_ip: "",
      login_date: now.toISOString(),
      deleted: false,
    } as any)
    .returningAll()
    .executeTakeFirstOrThrow()
  return mapDbRow(row)
}

export async function updateInDb(id: string, data: UpdateUserData, tenantId?: string): Promise<SystemUserRow> {
  const db = await getKyselyDb()
  const updateData: Record<string, any> = { updated_at: new Date() }
  if (data.username !== undefined) updateData.username = data.username
  if (data.nickname !== undefined) updateData.nickname = data.nickname
  if (data.password !== undefined) updateData.password = data.password
  if (data.salt !== undefined) updateData.salt = data.salt
  if (data.phone !== undefined) updateData.phone = data.phone
  if (data.email !== undefined) updateData.email = data.email
  if (data.deptId !== undefined) updateData.dept_id = data.deptId
  if (data.status !== undefined) updateData.status = data.status
  if (data.remark !== undefined) updateData.remark = data.remark

  let query = db.updateTable("system_user").set(updateData).where("id", "=", id).where("deleted", "=", false)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  const row = await query.returningAll().executeTakeFirstOrThrow()
  return mapDbRow(row)
}

export async function deleteInDb(id: string, tenantId?: string): Promise<void> {
  const db = await getKyselyDb()
  let query = db.updateTable("system_user").set({ deleted: true, updated_at: new Date() }).where("id", "=", id)
  if (tenantId) query = query.where("tenant_id", "=", tenantId)
  await query.execute()
}

export async function countFromDb(params?: { status?: string; tenantId?: string }): Promise<number> {
  const db = await getKyselyDb()
  let query = db.selectFrom("system_user").where("deleted", "=", false)
  if (params?.status) query = query.where("status", "=", params.status)
  if (params?.tenantId) query = query.where("tenant_id", "=", params.tenantId)
  const result = await query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
  return Number(result?.count ?? 0)
}

export async function findPostIdsFromDb(userId: string): Promise<string[]> {
  const db = await getKyselyDb()
  const rows = await db
    .selectFrom("system_user_post")
    .innerJoin("system_post", "system_post.id", "system_user_post.post_id")
    .select("system_user_post.post_id")
    .where("system_user_post.user_id", "=", userId)
    .where("system_post.deleted", "=", false)
    .execute()
  return rows.map((row) => row.post_id)
}

export async function replacePostsInDb(userId: string, postIds: string[]): Promise<void> {
  const db = await getKyselyDb()
  await db.transaction().execute(async (trx) => {
    await trx.deleteFrom("system_user_post").where("user_id", "=", userId).execute()
    if (postIds.length) {
      await trx.insertInto("system_user_post").values(
        postIds.map((postId) => ({ id: randomUUID(), user_id: userId, post_id: postId }))
      ).execute()
    }
  })
}

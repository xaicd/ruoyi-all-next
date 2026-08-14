import { getKyselyDb } from "@/modules/shared/backend/lib/database"

type LoginLogQuery = { page: number; pageSize: number; keyword?: string; result?: "SUCCESS" | "FAIL" }

function toItem(row: Awaited<ReturnType<typeof selectLoginLog>>) {
  return { id: row.id, userId: row.user_id, username: row.username, userIp: row.user_ip, userAgent: row.user_agent, result: row.result, remark: row.remark, tenantId: row.tenant_id, createdAt: row.created_at.toISOString() }
}

async function selectLoginLog(id: string) {
  const db = await getKyselyDb()
  return db.selectFrom("system_login_log").selectAll().where("id", "=", id).executeTakeFirstOrThrow()
}

export class LoginLogService {
  static async page(input: LoginLogQuery) {
    const db = await getKyselyDb()
    let query = db.selectFrom("system_login_log")
    if (input.keyword) {
      const like = `%${input.keyword}%`
      query = query.where((eb) => eb.or([eb("username", "ilike", like), eb("user_ip", "ilike", like)]))
    }
    if (input.result) query = query.where("result", "=", input.result)
    const [rows, count] = await Promise.all([
      query.selectAll().orderBy("created_at", "desc").offset((input.page - 1) * input.pageSize).limit(input.pageSize).execute(),
      query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow(),
    ])
    return { items: rows.map(toItem), total: Number(count.count), page: input.page, pageSize: input.pageSize }
  }

  static async get(id: string) {
    const db = await getKyselyDb()
    const row = await db.selectFrom("system_login_log").selectAll().where("id", "=", id).executeTakeFirst()
    return row ? toItem(row) : null
  }
}

export { LoginLogService as SystemLoginLogService }

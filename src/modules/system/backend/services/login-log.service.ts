import { getKyselyDb } from "@/modules/shared/backend/lib/database"

type LoginLogQuery = { page?: number; pageSize?: number; keyword?: string; result?: "SUCCESS" | "FAIL" }

function toItem(row: Awaited<ReturnType<typeof selectLoginLog>>) {
  return { id: row.id, userId: row.user_id, username: row.username, userIp: row.user_ip, userAgent: row.user_agent, result: row.result, remark: row.remark, tenantId: row.tenant_id, createdAt: row.created_at.toISOString() }
}

async function selectLoginLog(id: string) {
  const db = await getKyselyDb()
  return db.selectFrom("system_login_log").selectAll().where("id", "=", id).executeTakeFirstOrThrow()
}

export class LoginLogService {
  static async page(input: LoginLogQuery) {
    const page = input.page ?? 1
    const pageSize = input.pageSize ?? 20
    const db = await getKyselyDb()
    let query = db.selectFrom("system_login_log")
    if (input.keyword) {
      const like = `%${input.keyword}%`
      query = query.where((eb) => eb.or([eb("username", "ilike", like), eb("user_ip", "ilike", like)]))
    }
    if (input.result) query = query.where("result", "=", input.result)
    const [rows, count] = await Promise.all([
      query.selectAll().orderBy("created_at", "desc").offset((page - 1) * pageSize).limit(pageSize).execute(),
      query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow(),
    ])
    return { items: rows.map(toItem), total: Number(count.count), page, pageSize }
  }

  static async get(id: string) {
    const db = await getKyselyDb()
    const row = await db.selectFrom("system_login_log").selectAll().where("id", "=", id).executeTakeFirst()
    return row ? toItem(row) : null
  }

  static async exportRows(input: LoginLogQuery) { return (await this.page({ ...input, page: 1, pageSize: 10_000 })).items }

  static async getLoginLog(input: { id: string }) { return this.get(input.id) }
  static async exportLoginLogs(input: LoginLogQuery) { return this.exportRows(input) }
}

export { LoginLogService as SystemLoginLogService }

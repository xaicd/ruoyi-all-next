import { getKyselyDb } from "@/modules/shared/backend/lib/database"

type OperateLogQuery = { page?: number; pageSize?: number; keyword?: string; module?: string }

function toItem(row: Awaited<ReturnType<typeof selectOperateLog>>) {
  return { id: row.id, userId: row.user_id, module: row.module, name: row.name, type: row.type, requestMethod: row.request_method, requestUrl: row.request_url, content: row.content, resultCode: row.result_code, duration: row.duration, userIp: row.user_ip, tenantId: row.tenant_id, createdAt: row.created_at.toISOString() }
}

async function selectOperateLog(id: string) {
  const db = await getKyselyDb()
  return db.selectFrom("system_operate_log").selectAll().where("id", "=", id).executeTakeFirstOrThrow()
}

export class OperateLogService {
  static async page(input: OperateLogQuery) {
    const page = input.page ?? 1
    const pageSize = input.pageSize ?? 20
    const db = await getKyselyDb()
    let query = db.selectFrom("system_operate_log")
    if (input.keyword) {
      const like = `%${input.keyword}%`
      query = query.where((eb) => eb.or([eb("name", "ilike", like), eb("request_url", "ilike", like)]))
    }
    if (input.module) query = query.where("module", "=", input.module)
    const [rows, count] = await Promise.all([
      query.selectAll().orderBy("created_at", "desc").offset((page - 1) * pageSize).limit(pageSize).execute(),
      query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow(),
    ])
    return { items: rows.map(toItem), total: Number(count.count), page, pageSize }
  }

  static async get(id: string) {
    const db = await getKyselyDb()
    const row = await db.selectFrom("system_operate_log").selectAll().where("id", "=", id).executeTakeFirst()
    return row ? toItem(row) : null
  }

  static async exportRows(input: OperateLogQuery) { return (await this.page({ ...input, page: 1, pageSize: 10_000 })).items }

  static async getOperateLog(input: { id: string }) { return this.get(input.id) }
  static async exportOperateLogs(input: OperateLogQuery) { return this.exportRows(input) }
}

export { OperateLogService as SystemOperateLogService }

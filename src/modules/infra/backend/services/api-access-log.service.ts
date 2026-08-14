import { getKyselyDb } from "@/modules/shared/backend/lib/database"

type ApiAccessLogQuery = { page: number; pageSize: number; keyword?: string }

function toItem(row: Awaited<ReturnType<typeof selectAccessLog>>) {
  return { id: row.id, traceId: row.trace_id, userId: row.user_id, tenantId: row.tenant_id, applicationName: row.application_name, requestMethod: row.request_method, requestUrl: row.request_url, requestParams: row.request_params, responseBody: row.response_body, resultCode: row.result_code, duration: row.duration, userIp: row.user_ip, userAgent: row.user_agent, operation: row.operation, createdAt: row.created_at.toISOString() }
}

async function selectAccessLog(id: string) {
  const db = await getKyselyDb()
  return db.selectFrom("infra_api_access_log").selectAll().where("id", "=", id).executeTakeFirstOrThrow()
}

export class ApiAccessLogService {
  static async page(input: ApiAccessLogQuery) {
    const db = await getKyselyDb()
    let query = db.selectFrom("infra_api_access_log")
    if (input.keyword) {
      const like = `%${input.keyword}%`
      query = query.where((eb) => eb.or([eb("request_url", "ilike", like), eb("request_method", "ilike", like), eb("trace_id", "ilike", like)]))
    }
    const [rows, count] = await Promise.all([
      query.selectAll().orderBy("created_at", "desc").offset((input.page - 1) * input.pageSize).limit(input.pageSize).execute(),
      query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow(),
    ])
    return { items: rows.map(toItem), total: Number(count.count), page: input.page, pageSize: input.pageSize }
  }

  static async get(id: string) {
    const db = await getKyselyDb()
    const row = await db.selectFrom("infra_api_access_log").selectAll().where("id", "=", id).executeTakeFirst()
    return row ? toItem(row) : null
  }
}

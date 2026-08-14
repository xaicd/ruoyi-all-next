import { getKyselyDb } from "@/modules/shared/backend/lib/database"

type ApiErrorLogQuery = { page: number; pageSize: number; keyword?: string; status?: "UNPROCESSED" | "PROCESSED" }

function toItem(row: Awaited<ReturnType<typeof selectErrorLog>>) {
  return { id: row.id, traceId: row.trace_id, userId: row.user_id, tenantId: row.tenant_id, applicationName: row.application_name, requestMethod: row.request_method, requestUrl: row.request_url, requestParams: row.request_params, exceptionName: row.exception_name, exceptionMessage: row.exception_message, exceptionStack: row.exception_stack, errorCode: row.error_code, rootCause: row.root_cause, status: row.status, userIp: row.user_ip, userAgent: row.user_agent, createdAt: row.created_at.toISOString() }
}

async function selectErrorLog(id: string) {
  const db = await getKyselyDb()
  return db.selectFrom("infra_api_error_log").selectAll().where("id", "=", id).executeTakeFirstOrThrow()
}

export class ApiErrorLogService {
  static async page(input: ApiErrorLogQuery) {
    const db = await getKyselyDb()
    let query = db.selectFrom("infra_api_error_log")
    if (input.keyword) {
      const like = `%${input.keyword}%`
      query = query.where((eb) => eb.or([eb("request_url", "ilike", like), eb("exception_message", "ilike", like), eb("trace_id", "ilike", like), eb("error_code", "ilike", like)]))
    }
    if (input.status) query = query.where("status", "=", input.status)
    const [rows, count] = await Promise.all([
      query.selectAll().orderBy("created_at", "desc").offset((input.page - 1) * input.pageSize).limit(input.pageSize).execute(),
      query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow(),
    ])
    return { items: rows.map(toItem), total: Number(count.count), page: input.page, pageSize: input.pageSize }
  }

  static async get(id: string) {
    const db = await getKyselyDb()
    const row = await db.selectFrom("infra_api_error_log").selectAll().where("id", "=", id).executeTakeFirst()
    return row ? toItem(row) : null
  }

  static async markProcessed(id: string) {
    const db = await getKyselyDb()
    const result = await db.updateTable("infra_api_error_log").set({ status: "PROCESSED" }).where("id", "=", id).executeTakeFirst()
    return { success: Number(result.numUpdatedRows) > 0 }
  }
}

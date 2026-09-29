import { getKyselyDb } from "@/modules/shared/backend/lib/database"

type ApiErrorLogQuery = { page?: number; pageSize?: number; keyword?: string; status?: "UNPROCESSED" | "PROCESSED" }

function toItem(row: Awaited<ReturnType<typeof selectErrorLog>>) {
  return { id: row.id, traceId: row.trace_id, userId: row.user_id, tenantId: row.tenant_id, applicationName: row.application_name, requestMethod: row.request_method, requestUrl: row.request_url, requestParams: row.request_params, exceptionName: row.exception_name, exceptionMessage: row.exception_message, exceptionStack: row.exception_stack, errorCode: row.error_code, rootCause: row.root_cause, status: row.status, processedAt: row.processed_at?.toISOString() ?? null, processedBy: row.processed_by, processNote: row.process_note, userIp: row.user_ip, userAgent: row.user_agent, createdAt: row.created_at.toISOString() }
}

async function selectErrorLog(id: string) {
  const db = await getKyselyDb()
  return db.selectFrom("infra_api_error_log").selectAll().where("id", "=", id).executeTakeFirstOrThrow()
}

export class ApiErrorLogService {
  static async page(input: ApiErrorLogQuery) {
    const page = input.page ?? 1
    const pageSize = input.pageSize ?? 20
    const db = await getKyselyDb()
    let query = db.selectFrom("infra_api_error_log")
    if (input.keyword) {
      const like = `%${input.keyword}%`
      query = query.where((eb) => eb.or([eb("request_url", "ilike", like), eb("exception_message", "ilike", like), eb("trace_id", "ilike", like), eb("error_code", "ilike", like)]))
    }
    if (input.status) query = query.where("status", "=", input.status)
    const [rows, count] = await Promise.all([query.selectAll().orderBy("created_at", "desc").offset((page - 1) * pageSize).limit(pageSize).execute(), query.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow()])
    return { items: rows.map(toItem), total: Number(count.count), page, pageSize }
  }

  static async get(id: string) {
    const db = await getKyselyDb()
    const row = await db.selectFrom("infra_api_error_log").selectAll().where("id", "=", id).executeTakeFirst()
    return row ? toItem(row) : null
  }

  static async exportRows(input: ApiErrorLogQuery) { return (await this.page({ ...input, page: 1, pageSize: 10_000 })).items }

  static async markProcessed(id: string, input: { processedBy: string; processNote?: string }) {
    const db = await getKyselyDb()
    const result = await db.updateTable("infra_api_error_log").set({ status: "PROCESSED", processed_at: new Date(), processed_by: input.processedBy, process_note: input.processNote ?? null }).where("id", "=", id).where("status", "=", "UNPROCESSED").executeTakeFirst()
    return { success: Number(result.numUpdatedRows) > 0 }
  }

  static async getApiErrorLog(input: { id: string }) { return this.get(input.id) }
  static async processApiErrorLog(input: { id: string; processedBy: string; processNote?: string }) {
    return this.markProcessed(input.id, { processedBy: input.processedBy, processNote: input.processNote })
  }

  static async exportApiErrorLogs(input: ApiErrorLogQuery) { return this.exportRows(input) }
}

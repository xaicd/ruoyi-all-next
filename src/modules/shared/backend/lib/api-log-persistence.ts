import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "./database"
import { redact } from "./observability"

export type ApiAccessLogInput = {
  traceId: string
  method: string
  path: string
  status: number
  durationMs: number
  outcome?: string
  errorCode?: string
  resultMessage?: string
  userId?: string
  tenantId?: string
  userIp?: string
  userAgent?: string
  operation?: string
}
export type ApiErrorLogInput = ApiAccessLogInput & { errorName: string; errorMessage: string; errorCode?: string; stack?: string; rootCause?: string }

function encode(value: unknown): string | null {
  if (value === undefined) return null
  return JSON.stringify(redact(value))
}

/** Best-effort persistence: logging failures must never change the business response. */
export async function persistApiAccessLog(input: ApiAccessLogInput): Promise<void> {
  if (!hasRealDatabase()) return
  try {
    const db = await getKyselyDb()
    await db.insertInto("infra_api_access_log").values({
      id: randomUUID(), trace_id: input.traceId, user_id: input.userId ?? null, tenant_id: input.tenantId ?? null,
      application_name: "ruoyi-all-next", request_method: input.method, request_url: input.path,
      request_params: encode({ outcome: input.outcome, errorCode: input.errorCode, resultMessage: input.resultMessage }),
      response_body: null, result_code: input.status, duration: input.durationMs, user_ip: input.userIp ?? null,
      user_agent: input.userAgent ?? null, operation: input.operation ?? null, created_at: new Date(),
    }).execute()
  } catch (error) {
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", event: "audit.api_access.persist_failed", traceId: input.traceId, fields: { errorMessage: error instanceof Error ? error.message : String(error) } }))
  }
}

export async function persistApiErrorLog(input: ApiErrorLogInput): Promise<void> {
  if (!hasRealDatabase()) return
  try {
    const db = await getKyselyDb()
    await db.insertInto("infra_api_error_log").values({
      id: randomUUID(), trace_id: input.traceId, user_id: input.userId ?? null, tenant_id: input.tenantId ?? null,
      application_name: "ruoyi-all-next", request_method: input.method, request_url: input.path,
      request_params: encode({ operation: input.operation }), exception_name: input.errorName,
      exception_message: String(redact(input.errorMessage)), exception_stack: input.stack ? String(redact(input.stack)) : null,
      error_code: input.errorCode ?? null, root_cause: input.rootCause ? String(redact(input.rootCause)) : null,
      status: "UNPROCESSED", user_ip: input.userIp ?? null, user_agent: input.userAgent ?? null, created_at: new Date(),
    }).execute()
  } catch (error) {
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), level: "error", event: "audit.api_error.persist_failed", traceId: input.traceId, fields: { errorMessage: error instanceof Error ? error.message : String(error) } }))
  }
}

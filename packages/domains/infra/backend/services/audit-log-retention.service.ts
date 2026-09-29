import { getKyselyDb } from "@/modules/shared/backend/lib/database"
import { configCenter } from "@/modules/shared/backend/lib/config-center"

export type AuditLogRetentionResult = {
  dryRun: boolean
  cutoffAt: string
  accessLogs: number
  errorLogs: number
  loginLogs: number
  operateLogs: number
}

function retentionDays() {
  const value = configCenter.get("infra", "AUDIT_LOG_RETENTION_DAYS", 180)
  return Number.isInteger(value) && value >= 30 && value <= 3650 ? value : 180
}

/** Deletes only records older than the configured period. Callers should dry-run first. */
export class AuditLogRetentionService {
  static async run({ dryRun = true }: { dryRun?: boolean } = {}): Promise<AuditLogRetentionResult> {
    const cutoff = new Date(Date.now() - retentionDays() * 86_400_000)
    const db = await getKyselyDb()
    const count = async (table: "infra_api_access_log" | "infra_api_error_log" | "system_login_log" | "system_operate_log") => Number((await db.selectFrom(table).select((eb) => eb.fn.countAll<number>().as("count")).where("created_at", "<", cutoff).executeTakeFirstOrThrow()).count)
    const [accessLogs, errorLogs, loginLogs, operateLogs] = await Promise.all([count("infra_api_access_log"), count("infra_api_error_log"), count("system_login_log"), count("system_operate_log")])
    if (!dryRun) await Promise.all([
      db.deleteFrom("infra_api_access_log").where("created_at", "<", cutoff).execute(),
      db.deleteFrom("infra_api_error_log").where("created_at", "<", cutoff).execute(),
      db.deleteFrom("system_login_log").where("created_at", "<", cutoff).execute(),
      db.deleteFrom("system_operate_log").where("created_at", "<", cutoff).execute(),
    ])
    return { dryRun, cutoffAt: cutoff.toISOString(), accessLogs, errorLogs, loginLogs, operateLogs }
  }
}

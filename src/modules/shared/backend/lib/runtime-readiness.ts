import { validateJwtConfiguration } from "@/modules/shared/backend/auth/jwt"
import {
  assertProductionDataSourceConfiguration,
  getDataSourceConfig,
  getKyselyDb,
  hasRealDatabase,
} from "@/modules/shared/backend/lib/database"
import { sql } from "kysely"
import { writeStructuredLog } from "./observability"

export type ReadinessResult = { ready: true } | { ready: false; reason: string }

/** Checks only process dependencies required before a replica receives traffic. */
export async function checkRuntimeReadiness(): Promise<ReadinessResult> {
  try {
    validateJwtConfiguration()
    assertProductionDataSourceConfiguration()

    if (process.env.NODE_ENV === "production" && !hasRealDatabase()) {
      return { ready: false, reason: "persistent database is required in production" }
    }

    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      await sql`select 1`.execute(db)
    }

    return { ready: true }
  } catch (error) {
    const cause = error instanceof Error ? error : new Error("Unknown readiness error")
    writeStructuredLog("error", "runtime.readiness.failed", {
      errorName: cause.name,
      errorCode: (cause as Error & { code?: string }).code,
      errorMessage: cause.message,
      stack: cause.stack,
    })
    return { ready: false, reason: "required runtime dependency is unavailable" }
  }
}

export function getLivenessPayload() {
  // Liveness must not inspect configuration, network, or other dependencies.
  // An unready replica remains alive so its orchestrator can restart it safely.
  return { success: true, data: { status: "live" } }
}

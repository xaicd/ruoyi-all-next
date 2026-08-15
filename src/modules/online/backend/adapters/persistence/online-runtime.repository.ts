import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { compileOnlineRuntimeRelease, validateOnlineRuntimeData, verifyOnlineReleaseChecksum } from "../../application/online-runtime.compiler"
import type { OnlineRuntimeRecord, OnlineRuntimeRecordPage, OnlineRuntimeRelease, OnlineTestSessionDetail, OnlineTestSessionSummary } from "../../application/online-runtime.contract"

function requireDatabase(): void {
  if (!hasRealDatabase()) throw new ApiError("DEPENDENCY_UNAVAILABLE", "Online Runtime 需要已迁移的 PostgreSQL 数据库")
}
function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}
function date(value: Date | string): string { return value instanceof Date ? value.toISOString() : String(value) }
function mapRecord(row: any): OnlineRuntimeRecord {
  return { id: row.id, sessionId: row.test_session_id, releaseId: row.release_id, schemaRevision: row.schema_revision, data: asRecord(row.data_json), createdAt: date(row.created_at), updatedAt: date(row.updated_at) }
}
function mapSession(row: any, runtime: OnlineRuntimeRelease): OnlineTestSessionSummary {
  return { id: row.id, definitionCode: runtime.definitionCode, releaseId: row.release_id, schemaRevision: row.schema_revision, sandbox: row.sandbox, startedAt: date(row.started_at) }
}

export class KyselyOnlineRuntimeRepository {
  private static async resolveCurrentRelease(input: { tenantId: string; definitionCode: string }): Promise<OnlineRuntimeRelease> {
    requireDatabase()
    const db = await getKyselyDb()
    const definition = await db.selectFrom("online_definition").select(["id", "published_release_id"]).where("tenant_id", "=", input.tenantId).where("code", "=", input.definitionCode).where("deleted", "=", false).executeTakeFirst()
    if (!definition) throw new ApiError("NOT_FOUND", "Online Definition 不存在")
    if (!definition.published_release_id) throw new ApiError("CONFLICT", "Online Definition 尚未发布，不能进入在线测试")
    const release = await db.selectFrom("online_release").selectAll().where("id", "=", definition.published_release_id).where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).executeTakeFirst()
    if (!release) throw new ApiError("CONFLICT", "当前 Published Release 不存在")
    verifyOnlineReleaseChecksum(release.snapshot_json, release.checksum)
    const runtime = compileOnlineRuntimeRelease(release)
    if (runtime.modelType !== "SINGLE") throw new ApiError("CONFLICT", `${runtime.modelType} Runtime 尚未启用；当前 Online Test 仅支持 SINGLE`)
    if (runtime.model.storage.kind !== "GENERIC_RECORD") throw new ApiError("CONFLICT", "当前 Published Release 未使用受支持的 GENERIC_RECORD 存储")
    return runtime
  }

  private static async sessionContext(input: { tenantId: string; actorId: string; definitionCode: string; sessionId: string }): Promise<{ runtime: OnlineRuntimeRelease; session: any }> {
    requireDatabase()
    const db = await getKyselyDb()
    const session = await db.selectFrom("online_test_session")
      .innerJoin("online_definition", "online_definition.id", "online_test_session.definition_id")
      .innerJoin("online_release", "online_release.id", "online_test_session.release_id")
      .select(["online_test_session.id", "online_test_session.definition_id", "online_test_session.revision_id", "online_test_session.release_id", "online_test_session.tenant_id", "online_test_session.actor_id", "online_test_session.schema_revision", "online_test_session.environment", "online_test_session.sandbox", "online_test_session.started_at", "online_test_session.ended_at", "online_definition.code", "online_release.snapshot_json", "online_release.checksum"])
      .where("online_test_session.id", "=", input.sessionId).where("online_test_session.tenant_id", "=", input.tenantId).where("online_test_session.actor_id", "=", input.actorId).where("online_definition.code", "=", input.definitionCode).where("online_definition.deleted", "=", false).where("online_test_session.sandbox", "=", true).where("online_test_session.ended_at", "is", null).executeTakeFirst()
    if (!session) throw new ApiError("NOT_FOUND", "Online Test Session 不存在、已结束或无权访问")
    verifyOnlineReleaseChecksum(session.snapshot_json, session.checksum)
    const runtime = compileOnlineRuntimeRelease({ id: session.release_id, definition_id: session.definition_id, revision_id: session.revision_id, schema_revision: session.schema_revision, snapshot_json: session.snapshot_json })
    if (runtime.modelType !== "SINGLE" || runtime.model.storage.kind !== "GENERIC_RECORD") throw new ApiError("CONFLICT", "该 Session 的 Release 不支持当前 Runtime")
    return { runtime, session }
  }

  static async startTestSession(input: { tenantId: string; actorId: string; definitionCode: string }): Promise<OnlineTestSessionDetail> {
    const runtime = await this.resolveCurrentRelease(input)
    const db = await getKyselyDb()
    const now = new Date()
    const row = await db.insertInto("online_test_session").values({ id: crypto.randomUUID(), definition_id: runtime.definitionId, revision_id: runtime.revisionId, release_id: runtime.releaseId, tenant_id: input.tenantId, actor_id: input.actorId, schema_revision: runtime.schemaRevision, environment: "ONLINE_TEST", sandbox: true, started_at: now, ended_at: null }).returningAll().executeTakeFirstOrThrow()
    return { ...mapSession(row, runtime), runtime: { definitionCode: runtime.definitionCode, definitionName: runtime.definitionName, modelType: runtime.modelType, releaseId: runtime.releaseId, schemaRevision: runtime.schemaRevision, model: runtime.model, interaction: runtime.interaction, views: runtime.views } }
  }

  static async getTestSession(input: { tenantId: string; actorId: string; definitionCode: string; sessionId: string }): Promise<OnlineTestSessionDetail> {
    const { runtime, session } = await this.sessionContext(input)
    return { ...mapSession(session, runtime), runtime: { definitionCode: runtime.definitionCode, definitionName: runtime.definitionName, modelType: runtime.modelType, releaseId: runtime.releaseId, schemaRevision: runtime.schemaRevision, model: runtime.model, interaction: runtime.interaction, views: runtime.views } }
  }

  static async pageRecords(input: { tenantId: string; actorId: string; definitionCode: string; sessionId: string; page: number; pageSize: number }): Promise<OnlineRuntimeRecordPage> {
    const { runtime, session } = await this.sessionContext(input)
    const db = await getKyselyDb()
    const base = db.selectFrom("online_record").where("tenant_id", "=", input.tenantId).where("definition_id", "=", runtime.definitionId).where("release_id", "=", runtime.releaseId).where("test_session_id", "=", session.id).where("deleted", "=", false)
    const count = await base.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
    const rows = await base.selectAll().orderBy("updated_at", "desc").offset((input.page - 1) * input.pageSize).limit(input.pageSize).execute()
    return { items: rows.map(mapRecord), total: Number(count?.count ?? 0), page: input.page, pageSize: input.pageSize }
  }

  static async createRecord(input: { tenantId: string; actorId: string; definitionCode: string; sessionId: string; data: Record<string, unknown> }): Promise<OnlineRuntimeRecord> {
    const { runtime, session } = await this.sessionContext(input)
    const data = validateOnlineRuntimeData(runtime, input.data, "CREATE")
    const db = await getKyselyDb()
    const now = new Date()
    const row = await db.insertInto("online_record").values({ id: crypto.randomUUID(), tenant_id: input.tenantId, definition_id: runtime.definitionId, release_id: runtime.releaseId, test_session_id: session.id, schema_revision: runtime.schemaRevision, data_json: data, created_by: input.actorId, updated_by: input.actorId, created_at: now, updated_at: now, deleted: false }).returningAll().executeTakeFirstOrThrow()
    return mapRecord(row)
  }

  static async updateRecord(input: { tenantId: string; actorId: string; definitionCode: string; sessionId: string; recordId: string; data: Record<string, unknown> }): Promise<OnlineRuntimeRecord> {
    const { runtime, session } = await this.sessionContext(input)
    const db = await getKyselyDb()
    const current = await db.selectFrom("online_record").selectAll().where("id", "=", input.recordId).where("tenant_id", "=", input.tenantId).where("definition_id", "=", runtime.definitionId).where("release_id", "=", runtime.releaseId).where("test_session_id", "=", session.id).where("deleted", "=", false).executeTakeFirst()
    if (!current) throw new ApiError("NOT_FOUND", "Online Test 记录不存在")
    const patch = validateOnlineRuntimeData(runtime, input.data, "UPDATE")
    const row = await db.updateTable("online_record").set({ data_json: { ...asRecord(current.data_json), ...patch }, updated_by: input.actorId, updated_at: new Date() }).where("id", "=", current.id).where("tenant_id", "=", input.tenantId).returningAll().executeTakeFirstOrThrow()
    return mapRecord(row)
  }

  static async deleteRecord(input: { tenantId: string; actorId: string; definitionCode: string; sessionId: string; recordId: string }): Promise<void> {
    const { runtime, session } = await this.sessionContext(input)
    const db = await getKyselyDb()
    const result = await db.updateTable("online_record").set({ deleted: true, updated_by: input.actorId, updated_at: new Date() }).where("id", "=", input.recordId).where("tenant_id", "=", input.tenantId).where("definition_id", "=", runtime.definitionId).where("release_id", "=", runtime.releaseId).where("test_session_id", "=", session.id).where("deleted", "=", false).executeTakeFirst()
    if (Number(result.numUpdatedRows) !== 1) throw new ApiError("NOT_FOUND", "Online Test 记录不存在")
  }
}

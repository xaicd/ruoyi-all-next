import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { buildOnlineSchemaPlan, fingerprintOnlineModelIR } from "../../application/online-schema-plan.compiler"
import type { OnlineSchemaPlanPayload, OnlineSchemaPlanSummary } from "../../application/online-schema-plan.contract"

function requireDatabase(): void {
  if (!hasRealDatabase()) throw new ApiError("DEPENDENCY_UNAVAILABLE", "Online Schema Plan 需要已迁移的 PostgreSQL 数据库，不支持内存持久化")
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function date(value: Date | string): string { return value instanceof Date ? value.toISOString() : String(value) }

function mapPlan(row: any): OnlineSchemaPlanSummary {
  const payload = asRecord(row.plan_json) as OnlineSchemaPlanPayload
  return {
    id: row.id,
    definitionId: row.definition_id,
    revisionId: row.revision_id,
    risk: row.risk,
    status: row.status,
    expectedSchemaRevision: row.expected_schema_revision,
    appliedSchemaRevision: row.applied_schema_revision,
    sourceFingerprint: String(payload.sourceFingerprint ?? ""),
    targetFingerprint: String(payload.targetFingerprint ?? ""),
    operations: Array.isArray(payload.operations) ? payload.operations : [],
    approval: row.approval ? asRecord(row.approval) : null,
    createdAt: date(row.created_at),
    updatedAt: date(row.updated_at),
  }
}

export class KyselyOnlineSchemaPlanRepository {
  static async list(input: { tenantId: string; code: string }): Promise<OnlineSchemaPlanSummary[]> {
    requireDatabase()
    const db = await getKyselyDb()
    const definition = await db.selectFrom("online_definition").select("id").where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
    if (!definition) throw new ApiError("NOT_FOUND", "Online Definition 不存在")
    const rows = await db.selectFrom("online_schema_change").selectAll().where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).orderBy("created_at", "desc").execute()
    return rows.map(mapPlan)
  }

  static async get(input: { tenantId: string; code: string; planId: string }): Promise<OnlineSchemaPlanSummary> {
    requireDatabase()
    const db = await getKyselyDb()
    const row = await db.selectFrom("online_schema_change")
      .innerJoin("online_definition", "online_definition.id", "online_schema_change.definition_id")
      .select(["online_schema_change.id", "online_schema_change.definition_id", "online_schema_change.revision_id", "online_schema_change.risk", "online_schema_change.status", "online_schema_change.plan_json", "online_schema_change.approval", "online_schema_change.expected_schema_revision", "online_schema_change.applied_schema_revision", "online_schema_change.created_at", "online_schema_change.updated_at"])
      .where("online_schema_change.tenant_id", "=", input.tenantId).where("online_schema_change.id", "=", input.planId).where("online_definition.code", "=", input.code).where("online_definition.deleted", "=", false).executeTakeFirst()
    if (!row) throw new ApiError("NOT_FOUND", "Schema Plan 不存在")
    return mapPlan(row)
  }

  static async createForCurrentDraft(input: { tenantId: string; actorId: string; code: string; expectedLockVersion: number }): Promise<OnlineSchemaPlanSummary> {
    requireDatabase()
    const db = await getKyselyDb()
    return db.transaction().execute(async (trx) => {
      const definition = await trx.selectFrom("online_definition").selectAll().where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
      if (!definition || definition.lock_version !== input.expectedLockVersion || !definition.current_draft_revision_id) throw new ApiError("CONFLICT", "Definition 不存在、无 Draft 或版本已过期")
      const revision = await trx.selectFrom("online_revision").selectAll().where("id", "=", definition.current_draft_revision_id).where("definition_id", "=", definition.id).where("tenant_id", "=", input.tenantId).where("status", "in", ["DRAFT", "VALIDATED"]).executeTakeFirst()
      if (!revision) throw new ApiError("CONFLICT", "当前 Draft Revision 不可创建 Schema Plan")
      const release = definition.published_release_id
        ? await trx.selectFrom("online_release").select("snapshot_json").where("id", "=", definition.published_release_id).where("definition_id", "=", definition.id).where("tenant_id", "=", input.tenantId).executeTakeFirst()
        : undefined
      const baseline = asRecord(asRecord(release?.snapshot_json).revision).model ?? {}
      const compiled = buildOnlineSchemaPlan(baseline, revision.model_json)
      const now = new Date()
      await trx.updateTable("online_schema_change").set({ status: "SUPERSEDED", updated_at: now }).where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).where("revision_id", "=", revision.id).where("status", "in", ["DRAFT", "REVIEW_REQUIRED", "APPROVED"]).execute()
      const id = crypto.randomUUID()
      const status = compiled.risk === "NONE" ? "APPROVED" : "REVIEW_REQUIRED"
      await trx.insertInto("online_schema_change").values({ id, definition_id: definition.id, revision_id: revision.id, tenant_id: input.tenantId, plan_json: compiled.payload, risk: compiled.risk, status, approval: null, execution_log: null, expected_schema_revision: revision.schema_revision, applied_schema_revision: null, created_by: input.actorId, created_at: now, updated_at: now }).execute()
      const changed = await trx.updateTable("online_definition").set({ updated_by: input.actorId, updated_at: now, lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).where("lock_version", "=", input.expectedLockVersion).executeTakeFirst()
      if (Number(changed.numUpdatedRows) !== 1) throw new ApiError("CONFLICT", "Definition 版本已过期")
      const row = await trx.selectFrom("online_schema_change").selectAll().where("id", "=", id).where("tenant_id", "=", input.tenantId).executeTakeFirstOrThrow()
      return mapPlan(row)
    })
  }

  static async approve(input: { tenantId: string; actorId: string; code: string; planId: string; expectedLockVersion: number; note?: string }): Promise<OnlineSchemaPlanSummary> {
    requireDatabase()
    const db = await getKyselyDb()
    return db.transaction().execute(async (trx) => {
      const definition = await trx.selectFrom("online_definition").selectAll().where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
      if (!definition || definition.lock_version !== input.expectedLockVersion || !definition.current_draft_revision_id) throw new ApiError("CONFLICT", "Definition 不存在、无 Draft 或版本已过期")
      const plan = await trx.selectFrom("online_schema_change").selectAll().where("id", "=", input.planId).where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).where("revision_id", "=", definition.current_draft_revision_id).executeTakeFirst()
      if (!plan) throw new ApiError("NOT_FOUND", "当前 Draft 的 Schema Plan 不存在")
      if (plan.status !== "REVIEW_REQUIRED") throw new ApiError("CONFLICT", "仅 REVIEW_REQUIRED Schema Plan 可以审批")
      if (plan.risk === "DESTRUCTIVE" || plan.risk === "UNSUPPORTED") throw new ApiError("CONFLICT", "破坏性或不支持的 Schema Plan 不能在当前阶段审批")
      const revision = await trx.selectFrom("online_revision").selectAll().where("id", "=", definition.current_draft_revision_id).where("tenant_id", "=", input.tenantId).executeTakeFirst()
      const payload = asRecord(plan.plan_json) as OnlineSchemaPlanPayload
      if (!revision || fingerprintOnlineModelIR(revision.model_json) !== payload.targetFingerprint) {
        await trx.updateTable("online_schema_change").set({ status: "SUPERSEDED", updated_at: new Date() }).where("id", "=", plan.id).where("tenant_id", "=", input.tenantId).execute()
        throw new ApiError("CONFLICT", "Draft 模型已变更，Schema Plan 已废弃")
      }
      const now = new Date()
      const approval = { decidedBy: input.actorId, decidedAt: now.toISOString(), ...(input.note ? { note: input.note } : {}) }
      const changed = await trx.updateTable("online_schema_change").set({ status: "APPROVED", approval, updated_at: now }).where("id", "=", plan.id).where("tenant_id", "=", input.tenantId).where("status", "=", "REVIEW_REQUIRED").executeTakeFirst()
      if (Number(changed.numUpdatedRows) !== 1) throw new ApiError("CONFLICT", "Schema Plan 状态已变化")
      await trx.updateTable("online_definition").set({ updated_by: input.actorId, updated_at: now, lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).where("lock_version", "=", input.expectedLockVersion).execute()
      const row = await trx.selectFrom("online_schema_change").selectAll().where("id", "=", plan.id).where("tenant_id", "=", input.tenantId).executeTakeFirstOrThrow()
      return mapPlan(row)
    })
  }
}

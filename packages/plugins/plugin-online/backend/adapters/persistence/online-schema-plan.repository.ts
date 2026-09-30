import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { sql } from "kysely"
import { buildOnlineSchemaPlan, fingerprintOnlineModelIR } from "../../application/online-schema-plan.compiler"
import type { OnlineFieldIR, OnlineIndexIR, OnlineModelIR, OnlineSchemaPlanPayload, OnlineSchemaPlanSummary } from "../../application/online-schema-plan.contract"

function requireDatabase(): void {
  if (!hasRealDatabase()) throw new ApiError("DEPENDENCY_UNAVAILABLE", "Online Schema Plan 需要已迁移的 PostgreSQL 数据库，不支持内存持久化")
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function date(value: Date | string): string { return value instanceof Date ? value.toISOString() : String(value) }
const identifier = /^[a-z][a-z0-9_]{1,63}$/
function quoteIdentifier(value: string): string { if (!identifier.test(value)) throw new ApiError("VALIDATION_ERROR", "物理表标识无效"); return `"${value}"` }
function physicalTableName(_definitionId: string, definitionCode: string): string { return definitionCode }
function columnType(field: OnlineFieldIR): string {
  if (field.type === "string") return `varchar(${field.length ?? 255})`
  if (field.type === "text") return "text"
  if (field.type === "integer") return "integer"
  if (field.type === "decimal") return `numeric(18, ${field.precision ?? 2})`
  if (field.type === "boolean") return "boolean"
  if (field.type === "date") return "date"
  if (field.type === "datetime") return "timestamptz"
  return "jsonb"
}
function columnDefault(field: OnlineFieldIR): string {
  if (field.default === undefined) return ""
  if (field.default === null) return " DEFAULT NULL"
  if (field.type === "boolean") return field.default ? " DEFAULT TRUE" : " DEFAULT FALSE"
  if (field.type === "integer" || field.type === "decimal") return ` DEFAULT ${field.default}`
  if (field.type === "json") return ` DEFAULT '${String(field.default).replace(/'/g, "''")}'::jsonb`
  return ` DEFAULT '${String(field.default).replace(/'/g, "''")}'`
}
function columnDefinition(field: OnlineFieldIR): string { return `${quoteIdentifier(field.code)} ${columnType(field)}${columnDefault(field)}${field.nullable ? "" : " NOT NULL"}` }
function indexName(tableName: string, index: OnlineIndexIR): string { return `idx_${tableName.slice(0, 48)}_${index.code}`.slice(0, 63) }
function expectedCatalogType(field: OnlineFieldIR): string {
  if (field.type === "string") return `character varying(${field.length ?? 255})`
  if (field.type === "text") return "text"
  if (field.type === "integer") return "integer"
  if (field.type === "decimal") return `numeric(18,${field.precision ?? 2})`
  if (field.type === "boolean") return "boolean"
  if (field.type === "date") return "date"
  if (field.type === "datetime") return "timestamp with time zone"
  return "jsonb"
}
function normalizeCatalogType(value: string): string { return value.replace(/\s+/g, "").toLowerCase() }
async function assertManagedTableCatalog(trx: any, input: { tableName: string; registry: unknown; baseline: OnlineModelIR }): Promise<void> {
  const result = await sql<{ column_name: string; column_type: string; not_null: boolean; index_name: string | null }>`
    SELECT attribute.attname AS column_name, format_type(attribute.atttypid, attribute.atttypmod) AS column_type, attribute.attnotnull AS not_null, NULL::text AS index_name
    FROM pg_attribute AS attribute
    INNER JOIN pg_class AS relation ON relation.oid = attribute.attrelid
    INNER JOIN pg_namespace AS namespace ON namespace.oid = relation.relnamespace
    WHERE namespace.nspname = 'public' AND relation.relname = ${input.tableName} AND attribute.attnum > 0 AND NOT attribute.attisdropped
    UNION ALL
    SELECT NULL::text AS column_name, NULL::text AS column_type, false AS not_null, pg_indexes.indexname AS index_name
    FROM pg_indexes
    WHERE pg_indexes.schemaname = 'public' AND pg_indexes.tablename = ${input.tableName}
  `.execute(trx)
  const columns = result.rows.filter((row) => row.column_name)
  if (!input.registry) {
    if (columns.length) throw new ApiError("CONFLICT", "同名物理表已存在且不属于当前 Online Definition，系统拒绝接管")
    return
  }
  if (!columns.length) throw new ApiError("CONFLICT", "已登记的 Online 物理表不存在或不在 public schema，检测到数据库漂移")
  const byCode = new Map(columns.map((column) => [column.column_name!, column]))
  for (const field of input.baseline.fields) {
    const column = byCode.get(field.code)
    if (!column || normalizeCatalogType(column.column_type) !== normalizeCatalogType(expectedCatalogType(field)) || column.not_null !== !field.nullable) {
      throw new ApiError("CONFLICT", `物理表 ${input.tableName} 与已发布模型不一致，检测到数据库漂移`)
    }
  }
  const indexNames = new Set(result.rows.flatMap((row) => row.index_name ? [row.index_name] : []))
  for (const index of input.baseline.indexes) if (!indexNames.has(indexName(input.tableName, index))) {
    throw new ApiError("CONFLICT", `物理表 ${input.tableName} 缺少受管索引 ${index.code}，检测到数据库漂移`)
  }
}
function assertSupportedManagedPlan(input: { modelType: string; payload: OnlineSchemaPlanPayload; registry: unknown }): OnlineModelIR {
  const { baseline, target, operations } = input.payload
  if (input.modelType !== "SINGLE" || target.storage.kind !== "MANAGED_TABLE") throw new ApiError("CONFLICT", "当前仅支持 SINGLE + MANAGED_TABLE 的物理表应用")
  if (target.relations.length) throw new ApiError("CONFLICT", "当前物理表应用不支持外键关联")
  if (!input.registry && baseline.storage.kind !== "GENERIC_RECORD") throw new ApiError("CONFLICT", "首次物理建表的基线不匹配")
  if (input.registry && baseline.storage.kind !== "MANAGED_TABLE") throw new ApiError("CONFLICT", "已有物理表不能切换存储模式")
  for (const operation of operations) {
    if (operation.kind === "NO_OP" || operation.kind === "ALTER_FIELD" && operation.subject === "storage") continue
    if (operation.kind === "ADD_FIELD") {
      const field = target.fields.find((item) => item.code === operation.subject)
      if (!field || input.registry && !field.nullable) throw new ApiError("CONFLICT", "当前仅支持向已存在物理表新增可空字段")
      continue
    }
    if (operation.kind === "ADD_INDEX") {
      const index = target.indexes.find((item) => item.code === operation.subject)
      if (!index || index.unique) throw new ApiError("CONFLICT", "当前仅支持新增普通索引")
      continue
    }
    throw new ApiError("CONFLICT", "当前物理表应用不支持删除、改类型、改字段属性或替换索引")
  }
  return target
}

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
      const revision = await trx.selectFrom("online_revision").selectAll().where("id", "=", definition.current_draft_revision_id).where("definition_id", "=", definition.id).where("tenant_id", "=", input.tenantId).where("status", "=", "VALIDATED").executeTakeFirst()
      if (!revision) throw new ApiError("CONFLICT", "请先校验当前 Draft Revision，校验通过后才能创建 Schema Plan")
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
      const changed = await trx.updateTable("online_definition").set({ updated_by: input.actorId, updated_at: now, lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).where("tenant_id", "=", input.tenantId).where("deleted", "=", false).where("lock_version", "=", input.expectedLockVersion).executeTakeFirst()
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
      const definitionChanged = await trx.updateTable("online_definition").set({ updated_by: input.actorId, updated_at: now, lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).where("tenant_id", "=", input.tenantId).where("deleted", "=", false).where("lock_version", "=", input.expectedLockVersion).executeTakeFirst()
      if (Number(definitionChanged.numUpdatedRows) !== 1) throw new ApiError("CONFLICT", "Definition 版本已过期")
      const row = await trx.selectFrom("online_schema_change").selectAll().where("id", "=", plan.id).where("tenant_id", "=", input.tenantId).executeTakeFirstOrThrow()
      return mapPlan(row)
    })
  }

  static async apply(input: { tenantId: string; actorId: string; code: string; planId: string; expectedLockVersion: number }): Promise<OnlineSchemaPlanSummary> {
    requireDatabase()
    const db = await getKyselyDb()
    let started = false
    try {
      return await db.transaction().execute(async (trx) => {
        const definition = await trx.selectFrom("online_definition").selectAll().where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
        if (!definition || definition.lock_version !== input.expectedLockVersion || !definition.current_draft_revision_id) throw new ApiError("CONFLICT", "Definition 不存在、无 Draft 或版本已过期")
        const revision = await trx.selectFrom("online_revision").selectAll().where("id", "=", definition.current_draft_revision_id).where("tenant_id", "=", input.tenantId).where("status", "=", "VALIDATED").executeTakeFirst()
        const plan = await trx.selectFrom("online_schema_change").selectAll().where("id", "=", input.planId).where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).where("revision_id", "=", definition.current_draft_revision_id).executeTakeFirst()
        if (!revision || !plan || plan.status !== "APPROVED") throw new ApiError("CONFLICT", "仅当前已校验且已审批的 Schema Plan 可以应用")
        const payload = asRecord(plan.plan_json) as OnlineSchemaPlanPayload
        if (fingerprintOnlineModelIR(revision.model_json) !== payload.targetFingerprint) throw new ApiError("CONFLICT", "Draft 模型已变更，Schema Plan 已废弃")
        const registry = await trx.selectFrom("online_managed_table").selectAll().where("definition_id", "=", definition.id).where("tenant_id", "=", input.tenantId).executeTakeFirst()
        const target = assertSupportedManagedPlan({ modelType: definition.model_type, payload, registry })
        const tableName = registry?.physical_table_name ?? physicalTableName(definition.id, definition.code)
        await sql`select pg_advisory_xact_lock(hashtext(${`online-managed:${definition.id}`}))`.execute(trx)
        await assertManagedTableCatalog(trx, { tableName, registry, baseline: payload.baseline })
        const applying = await trx.updateTable("online_schema_change").set({ status: "APPLYING", updated_at: new Date() }).where("id", "=", plan.id).where("tenant_id", "=", input.tenantId).where("status", "=", "APPROVED").executeTakeFirst()
        if (Number(applying.numUpdatedRows) !== 1) throw new ApiError("CONFLICT", "Schema Plan 状态已变化")
        started = true
        if (!registry) {
          await sql.raw(`CREATE TABLE ${quoteIdentifier(tableName)} (${target.fields.map(columnDefinition).join(", ")}, PRIMARY KEY (${quoteIdentifier("id")}))`).execute(trx)
          for (const index of target.indexes) await sql.raw(`CREATE ${index.unique ? "UNIQUE " : ""}INDEX ${quoteIdentifier(indexName(tableName, index))} ON ${quoteIdentifier(tableName)} (${index.fields.map(quoteIdentifier).join(", ")})`).execute(trx)
        } else {
          const baselineFields = new Set(payload.baseline.fields.map((field) => field.code))
          for (const field of target.fields.filter((item) => !baselineFields.has(item.code))) await sql.raw(`ALTER TABLE ${quoteIdentifier(tableName)} ADD COLUMN ${columnDefinition(field)}`).execute(trx)
          const baselineIndexes = new Set(payload.baseline.indexes.map((index) => index.code))
          for (const index of target.indexes.filter((item) => !baselineIndexes.has(item.code))) await sql.raw(`CREATE INDEX ${quoteIdentifier(indexName(tableName, index))} ON ${quoteIdentifier(tableName)} (${index.fields.map(quoteIdentifier).join(", ")})`).execute(trx)
        }
        const schemaRevision = revision.schema_revision + 1
        const now = new Date()
        if (registry) await trx.updateTable("online_managed_table").set({ schema_revision: schemaRevision, model_fingerprint: payload.targetFingerprint, last_plan_id: plan.id, updated_at: now }).where("id", "=", registry.id).execute()
        else await trx.insertInto("online_managed_table").values({ id: crypto.randomUUID(), tenant_id: input.tenantId, definition_id: definition.id, physical_table_name: tableName, schema_revision: schemaRevision, model_fingerprint: payload.targetFingerprint, last_plan_id: plan.id, created_at: now, updated_at: now }).execute()
        await trx.updateTable("online_revision").set({ schema_revision: schemaRevision, updated_at: now }).where("id", "=", revision.id).where("tenant_id", "=", input.tenantId).where("status", "=", "VALIDATED").execute()
        await trx.updateTable("online_schema_change").set({ status: "APPLIED", applied_schema_revision: schemaRevision, execution_log: { appliedBy: input.actorId, appliedAt: now.toISOString(), tableName, operationCount: payload.operations.length }, updated_at: now }).where("id", "=", plan.id).where("tenant_id", "=", input.tenantId).where("status", "=", "APPLYING").execute()
        const changed = await trx.updateTable("online_definition").set({ updated_by: input.actorId, updated_at: now, lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).where("tenant_id", "=", input.tenantId).where("lock_version", "=", input.expectedLockVersion).executeTakeFirst()
        if (Number(changed.numUpdatedRows) !== 1) throw new ApiError("CONFLICT", "Definition 版本已过期")
        const row = await trx.selectFrom("online_schema_change").selectAll().where("id", "=", plan.id).where("tenant_id", "=", input.tenantId).executeTakeFirstOrThrow()
        return mapPlan(row)
      })
    } catch (error) {
      if (started) {
        const message = error instanceof Error ? error.message.slice(0, 500) : "物理表应用失败"
        await db.updateTable("online_schema_change").set({ status: "FAILED", execution_log: { failedAt: new Date().toISOString(), error: message }, updated_at: new Date() }).where("id", "=", input.planId).where("tenant_id", "=", input.tenantId).where("status", "=", "APPROVED").execute()
      }
      throw error
    }
  }
}

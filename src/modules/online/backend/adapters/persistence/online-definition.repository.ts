import { createHash } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import type { OnlineDefinitionDetail, OnlineDefinitionPage, OnlineDefinitionSummary, OnlineFieldDetail, OnlineIndexDetail, OnlineRelationDetail, OnlineReleaseSummary, OnlineRevisionDetail, OnlineViewDetail } from "../../application/online-definition.contract"
import { compileOnlineViews, failViewValidation, fingerprintOnlineViews } from "../../application/online-view.compiler"
import { parseOnlineInteractionIR } from "../../application/online-interaction.compiler"
import { validateOnlineModelAggregate } from "../../application/online-model.validator"
import { fingerprintOnlineModelIR, parseOnlineModelIR } from "../../application/online-schema-plan.compiler"

function requireDatabase(): void {
  if (!hasRealDatabase()) throw new ApiError("DEPENDENCY_UNAVAILABLE", "Online Definition 需要已迁移的 PostgreSQL 数据库，不支持内存持久化")
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function date(value: Date | string): string { return value instanceof Date ? value.toISOString() : String(value) }
function mapDefinition(row: any): OnlineDefinitionSummary {
  return { id: row.id, code: row.code, name: row.name, modelType: row.model_type, status: row.status, lockVersion: row.lock_version, currentDraftRevisionId: row.current_draft_revision_id, publishedReleaseId: row.published_release_id, updatedAt: date(row.updated_at) }
}
function mapRevision(row: any, fields: OnlineFieldDetail[] = [], indexes: OnlineIndexDetail[] = [], relations: OnlineRelationDetail[] = [], views: OnlineViewDetail[] = []): OnlineRevisionDetail {
  return { id: row.id, definitionId: row.definition_id, sequence: row.sequence, status: row.status, schemaRevision: row.schema_revision, model: asRecord(row.model_json), interaction: asRecord(row.interaction_json), policy: asRecord(row.policy_json), workflow: asRecord(row.workflow_json), fields, indexes, relations, views, validationReport: row.validation_report ? asRecord(row.validation_report) : null, createdAt: date(row.created_at), updatedAt: date(row.updated_at) }
}
function mapField(row: any): OnlineFieldDetail {
  return { code: row.code, label: row.label, fieldType: row.field_type, required: row.required, length: row.length, sort: row.sort, defaultValue: row.default_value, config: asRecord(row.config) }
}
function mapIndex(row: any): OnlineIndexDetail { return { code: row.code, fields: Array.isArray(row.fields_json) ? row.fields_json.filter((field: unknown) => typeof field === "string") : [], unique: row.unique } }
function mapRelation(row: any): OnlineRelationDetail {
  const config = asRecord(row.config)
  return { code: row.code, type: row.relation_type, sourceField: String(config.sourceField ?? ""), targetDefinitionCode: String(row.target_definition_code ?? ""), targetField: String(config.targetField ?? ""), onDelete: config.onDelete === "SET_NULL" ? "SET_NULL" : "RESTRICT" }
}
function mapRelease(row: any): OnlineReleaseSummary {
  return { id: row.id, releaseNo: row.release_no, revisionId: row.revision_id, schemaRevision: row.schema_revision, checksum: row.checksum, releasedAt: date(row.released_at), rollbackOfReleaseId: row.rollback_of_release_id }
}
function mapView(row: any): OnlineViewDetail {
  return { code: row.code, kind: "PUCK", puckData: asRecord(row.puck_data_json), componentConfig: { configVersion: 1 }, version: 1 }
}
function checksum(snapshot: unknown): string { return createHash("sha256").update(JSON.stringify(snapshot)).digest("hex") }

function viewScope(definitionCode: string, model: ReturnType<typeof parseOnlineModelIR>, interaction: ReturnType<typeof parseOnlineInteractionIR>, actionRows: readonly any[]) {
  return { definitionCode, fieldCodes: new Set(model.fields.map((field) => field.code)), actionCodes: new Set(actionRows.map((action) => action.code)) }
}

async function readViews(trx: any, tenantId: string, revisionId: string): Promise<OnlineViewDetail[]> {
  const rows = await trx.selectFrom("online_view").selectAll().where("tenant_id", "=", tenantId).where("revision_id", "=", revisionId).where("deleted", "=", false).orderBy("code", "asc").execute()
  return rows.map(mapView)
}

async function syncViews(trx: any, input: { tenantId: string; revisionId: string; views: OnlineViewDetail[] }): Promise<void> {
  await trx.deleteFrom("online_view").where("tenant_id", "=", input.tenantId).where("revision_id", "=", input.revisionId).execute()
  if (!input.views.length) return
  const now = new Date()
  await trx.insertInto("online_view").values(input.views.map((view) => ({ id: crypto.randomUUID(), revision_id: input.revisionId, tenant_id: input.tenantId, code: view.code, kind: view.kind, puck_data_json: view.puckData, component_config_json: view.componentConfig, version: view.version, created_at: now, updated_at: now, deleted: false }))).execute()
}

async function loadViewScope(_trx: any, input: { tenantId: string; revisionId: string; definitionCode: string; model: ReturnType<typeof parseOnlineModelIR>; interaction: ReturnType<typeof parseOnlineInteractionIR> }) {
  return viewScope(input.definitionCode, input.model, input.interaction, input.interaction.actions)
}

async function validateRelationTargets(trx: any, input: { tenantId: string; definitionCode: string; model: ReturnType<typeof parseOnlineModelIR> }): Promise<void> {
  const targets = [...new Set(input.model.relations.map((relation) => relation.targetDefinitionCode))]
  if (!targets.length) return
  if (targets.includes(input.definitionCode)) throw new Error("当前阶段不允许 Relation 自引用 Definition")
  const definitions = await trx.selectFrom("online_definition").select(["code", "current_draft_revision_id"]).where("tenant_id", "=", input.tenantId).where("deleted", "=", false).where("code", "in", targets).execute() as Array<{ code: string; current_draft_revision_id: string | null }>
  const definitionByCode = new Map(definitions.map((definition) => [definition.code, definition]))
  for (const target of targets) if (!definitionByCode.has(target)) throw new Error(`关联目标 Definition ${target} 不存在或不属于当前租户`)
  const revisionIds = definitions.flatMap((definition) => definition.current_draft_revision_id ? [definition.current_draft_revision_id] : [])
  const revisions = (revisionIds.length ? await trx.selectFrom("online_revision").select(["id", "model_json"]).where("tenant_id", "=", input.tenantId).where("id", "in", revisionIds).execute() : []) as Array<{ id: string; model_json: unknown }>
  const fieldsByRevision = new Map(revisions.map((revision) => [revision.id, new Set(parseOnlineModelIR(revision.model_json).fields.map((field) => field.code))]))
  for (const relation of input.model.relations) {
    const target = definitionByCode.get(relation.targetDefinitionCode)
    const targetFields = target?.current_draft_revision_id ? fieldsByRevision.get(target.current_draft_revision_id) : undefined
    if (!targetFields?.has(relation.targetField)) throw new Error(`关联 ${relation.code} 的目标字段 ${relation.targetDefinitionCode}.${relation.targetField} 不存在`)
  }
}

async function syncFieldProjection(trx: any, input: { tenantId: string; revisionId: string; model: ReturnType<typeof parseOnlineModelIR>; interaction: ReturnType<typeof parseOnlineInteractionIR> }): Promise<void> {
  await trx.deleteFrom("online_field").where("tenant_id", "=", input.tenantId).where("revision_id", "=", input.revisionId).execute()
  if (!input.model.fields.length) return
  const interactionByCode = new Map(input.interaction.fields.map((field) => [field.code, field]))
  const now = new Date()
  await trx.insertInto("online_field").values(input.model.fields.map((field, sort) => {
    const display = interactionByCode.get(field.code)
    return {
      id: crypto.randomUUID(), revision_id: input.revisionId, tenant_id: input.tenantId, code: field.code,
      label: display?.label ?? field.code, field_type: field.type, required: !field.nullable, length: field.length ?? null,
      sort, default_value: field.default === undefined || field.default === null ? null : String(field.default),
      config: { ...(display ?? {}), remark: field.remark, precision: field.precision, identity: field.identity, systemTemplate: field.systemTemplate }, created_at: now, updated_at: now, deleted: false,
    }
  })).execute()
}

async function syncIndexProjection(trx: any, input: { tenantId: string; revisionId: string; model: ReturnType<typeof parseOnlineModelIR> }): Promise<void> {
  await trx.deleteFrom("online_index").where("tenant_id", "=", input.tenantId).where("revision_id", "=", input.revisionId).execute()
  if (!input.model.indexes.length) return
  const now = new Date()
  await trx.insertInto("online_index").values(input.model.indexes.map((index) => ({ id: crypto.randomUUID(), revision_id: input.revisionId, tenant_id: input.tenantId, code: index.code, fields_json: index.fields, unique: index.unique, created_at: now, updated_at: now, deleted: false }))).execute()
}

async function syncRelationProjection(trx: any, input: { tenantId: string; revisionId: string; model: ReturnType<typeof parseOnlineModelIR> }): Promise<void> {
  await trx.deleteFrom("online_relation").where("tenant_id", "=", input.tenantId).where("revision_id", "=", input.revisionId).execute()
  if (!input.model.relations.length) return
  const now = new Date()
  await trx.insertInto("online_relation").values(input.model.relations.map((relation) => ({ id: crypto.randomUUID(), revision_id: input.revisionId, tenant_id: input.tenantId, code: relation.code, relation_type: relation.type, target_definition_code: relation.targetDefinitionCode, config: { sourceField: relation.sourceField, targetField: relation.targetField, onDelete: relation.onDelete }, created_at: now, updated_at: now, deleted: false }))).execute()
}

async function syncActionProjection(trx: any, input: { tenantId: string; revisionId: string; interaction: ReturnType<typeof parseOnlineInteractionIR> }): Promise<void> {
  await trx.deleteFrom("online_action").where("tenant_id", "=", input.tenantId).where("revision_id", "=", input.revisionId).execute()
  if (!input.interaction.actions.length) return
  const now = new Date()
  await trx.insertInto("online_action").values(input.interaction.actions.map((action) => ({ id: crypto.randomUUID(), revision_id: input.revisionId, tenant_id: input.tenantId, code: action.code, action_type: action.type, handler_key: null, config: { label: action.label, placement: action.placement, order: action.order, enabled: action.enabled }, created_at: now, updated_at: now, deleted: false }))).execute()
}

export class KyselyOnlineDefinitionRepository {
  static async page(input: { tenantId: string; page: number; pageSize: number }): Promise<Omit<OnlineDefinitionPage, "phase" | "persistence">> {
    requireDatabase()
    const db = await getKyselyDb()
    const base = db.selectFrom("online_definition").where("tenant_id", "=", input.tenantId).where("deleted", "=", false)
    const count = await base.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirst()
    const rows = await base.selectAll().orderBy("updated_at", "desc").offset((input.page - 1) * input.pageSize).limit(input.pageSize).execute()
    return { items: rows.map(mapDefinition), total: Number(count?.count ?? 0), page: input.page, pageSize: input.pageSize }
  }

  static async create(input: { tenantId: string; actorId: string; code: string; name: string; modelType: string }): Promise<OnlineDefinitionSummary> {
    requireDatabase()
    const db = await getKyselyDb()
    return db.transaction().execute(async (trx) => {
      const duplicate = await trx.selectFrom("online_definition").select("id").where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
      if (duplicate) throw new ApiError("CONFLICT", "当前租户已存在相同 code 的 Online Definition")
      const definitionId = crypto.randomUUID()
      const revisionId = crypto.randomUUID()
      const now = new Date()
      const initialModel = parseOnlineModelIR({})
      const initialInteraction = parseOnlineInteractionIR({}, initialModel)
      await trx.insertInto("online_definition").values({ id: definitionId, tenant_id: input.tenantId, code: input.code, name: input.name, model_type: input.modelType, status: "DRAFT", current_draft_revision_id: null, published_release_id: null, lock_version: 1, created_by: input.actorId, updated_by: input.actorId, created_at: now, updated_at: now, deleted: false }).execute()
      await trx.insertInto("online_revision").values({ id: revisionId, definition_id: definitionId, tenant_id: input.tenantId, sequence: 1, status: "DRAFT", schema_revision: 0, model_json: initialModel, interaction_json: initialInteraction, policy_json: {}, workflow_json: {}, validation_report: null, created_by: input.actorId, published_by: null, published_at: null, created_at: now, updated_at: now }).execute()
      await trx.updateTable("online_definition").set({ current_draft_revision_id: revisionId, updated_at: now }).where("id", "=", definitionId).execute()
      const row = await trx.selectFrom("online_definition").selectAll().where("id", "=", definitionId).executeTakeFirstOrThrow()
      return mapDefinition(row)
    })
  }

  static async detail(input: { tenantId: string; code: string }): Promise<OnlineDefinitionDetail> {
    requireDatabase()
    const db = await getKyselyDb()
    const definition = await db.selectFrom("online_definition").selectAll().where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
    if (!definition) throw new ApiError("NOT_FOUND", "Online Definition 不存在")
    const [revision, releases] = await Promise.all([
      definition.current_draft_revision_id ? db.selectFrom("online_revision").selectAll().where("id", "=", definition.current_draft_revision_id).where("tenant_id", "=", input.tenantId).executeTakeFirst() : undefined,
      db.selectFrom("online_release").selectAll().where("definition_id", "=", definition.id).where("tenant_id", "=", input.tenantId).orderBy("release_no", "desc").execute(),
    ])
    const [fields, indexes, relations, views] = revision ? await Promise.all([
      db.selectFrom("online_field").selectAll().where("tenant_id", "=", input.tenantId).where("revision_id", "=", revision.id).where("deleted", "=", false).orderBy("sort", "asc").execute(),
      db.selectFrom("online_index").selectAll().where("tenant_id", "=", input.tenantId).where("revision_id", "=", revision.id).where("deleted", "=", false).orderBy("code", "asc").execute(),
      db.selectFrom("online_relation").selectAll().where("tenant_id", "=", input.tenantId).where("revision_id", "=", revision.id).where("deleted", "=", false).orderBy("code", "asc").execute(),
      readViews(db, input.tenantId, revision.id),
    ]) : [[], [], [], []]
    return { ...mapDefinition(definition), revision: revision ? mapRevision(revision, fields.map(mapField), indexes.map(mapIndex), relations.map(mapRelation), views) : null, releases: releases.map(mapRelease) }
  }

  static async updateDefinition(input: { tenantId: string; actorId: string; code: string; name?: string; expectedLockVersion: number }): Promise<OnlineDefinitionSummary> {
    requireDatabase()
    const db = await getKyselyDb()
    const row = await db.updateTable("online_definition").set((eb) => ({ ...(input.name ? { name: input.name } : {}), updated_by: input.actorId, updated_at: new Date(), lock_version: eb("lock_version", "+", 1) } as any)).where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).where("lock_version", "=", input.expectedLockVersion).returningAll().executeTakeFirst()
    if (!row) throw new ApiError("CONFLICT", "Definition 不存在或版本已过期")
    return mapDefinition(row)
  }

  static async updateDraft(input: { tenantId: string; actorId: string; code: string; expectedLockVersion: number; model?: Record<string, unknown>; interaction?: Record<string, unknown>; views?: unknown[]; policy?: Record<string, unknown>; workflow?: Record<string, unknown> }): Promise<OnlineDefinitionDetail> {
    requireDatabase()
    const db = await getKyselyDb()
    await db.transaction().execute(async (trx) => {
      const definition = await trx.selectFrom("online_definition").selectAll().where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
      if (!definition || definition.lock_version !== input.expectedLockVersion || !definition.current_draft_revision_id) throw new ApiError("CONFLICT", "Definition 不存在、无 Draft 或版本已过期")
      const current = await trx.selectFrom("online_revision").selectAll().where("id", "=", definition.current_draft_revision_id).where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).where("status", "in", ["DRAFT", "VALIDATED"]).executeTakeFirst()
      if (!current) throw new ApiError("CONFLICT", "Draft Revision 已被发布或归档")
      const nextModel = parseOnlineModelIR(input.model ?? current.model_json)
      const nextInteraction = parseOnlineInteractionIR(input.interaction ?? current.interaction_json, nextModel)
      await validateRelationTargets(trx, { tenantId: input.tenantId, definitionCode: definition.code, model: nextModel })
      const nextViewScope = await loadViewScope(trx, { tenantId: input.tenantId, revisionId: current.id, definitionCode: definition.code, model: nextModel, interaction: nextInteraction })
      let nextViews: OnlineViewDetail[]
      try { nextViews = input.views === undefined ? await readViews(trx, input.tenantId, current.id) : compileOnlineViews(input.views, nextViewScope) } catch (error) { failViewValidation(error) }
      const modelChanged = fingerprintOnlineModelIR(current.model_json) !== fingerprintOnlineModelIR(nextModel)
      const updated = await trx.updateTable("online_revision").set({ ...(input.model !== undefined ? { model_json: nextModel } : {}), ...(input.interaction !== undefined ? { interaction_json: nextInteraction } : {}), ...(input.policy ? { policy_json: input.policy } : {}), ...(input.workflow ? { workflow_json: input.workflow } : {}), status: "DRAFT", validation_report: null, updated_at: new Date() }).where("id", "=", current.id).where("tenant_id", "=", input.tenantId).where("status", "in", ["DRAFT", "VALIDATED"]).executeTakeFirst()
      if (Number(updated.numUpdatedRows) !== 1) throw new ApiError("CONFLICT", "Draft Revision 已被发布或归档")
      if (input.model !== undefined || input.interaction !== undefined) {
        await syncFieldProjection(trx, { tenantId: input.tenantId, revisionId: current.id, model: nextModel, interaction: nextInteraction })
        await syncIndexProjection(trx, { tenantId: input.tenantId, revisionId: current.id, model: nextModel })
        await syncRelationProjection(trx, { tenantId: input.tenantId, revisionId: current.id, model: nextModel })
        await syncActionProjection(trx, { tenantId: input.tenantId, revisionId: current.id, interaction: nextInteraction })
      }
      if (input.views !== undefined) await syncViews(trx, { tenantId: input.tenantId, revisionId: current.id, views: nextViews })
      if (modelChanged) await trx.updateTable("online_schema_change").set({ status: "SUPERSEDED", updated_at: new Date() }).where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).where("revision_id", "=", current.id).where("status", "in", ["DRAFT", "REVIEW_REQUIRED", "APPROVED"]).execute()
      await trx.updateTable("online_definition").set({ updated_by: input.actorId, updated_at: new Date(), lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).where("lock_version", "=", input.expectedLockVersion).execute()
    })
    return this.detail({ tenantId: input.tenantId, code: input.code })
  }

  static async validateDraft(input: { tenantId: string; actorId: string; code: string; expectedLockVersion: number }): Promise<OnlineDefinitionDetail> {
    requireDatabase()
    const db = await getKyselyDb()
    await db.transaction().execute(async (trx) => {
      const definition = await trx.selectFrom("online_definition").selectAll().where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
      if (!definition || definition.lock_version !== input.expectedLockVersion || !definition.current_draft_revision_id) throw new ApiError("CONFLICT", "Definition 不存在、无 Draft 或版本已过期")
      const revision = await trx.selectFrom("online_revision").selectAll().where("id", "=", definition.current_draft_revision_id).where("tenant_id", "=", input.tenantId).executeTakeFirst()
      if (!revision || revision.status !== "DRAFT") throw new ApiError("CONFLICT", "仅 DRAFT Revision 可以校验")
      let modelFingerprint: string
      let viewFingerprint: string
      try {
        const model = parseOnlineModelIR(revision.model_json)
        const interaction = parseOnlineInteractionIR(revision.interaction_json, model)
        await validateRelationTargets(trx, { tenantId: input.tenantId, definitionCode: definition.code, model })
        validateOnlineModelAggregate(definition.model_type as any, definition.code, model, interaction)
        const storedViews = await readViews(trx, input.tenantId, revision.id)
        const views = compileOnlineViews(storedViews.map(({ code, kind, puckData, version }) => ({ code, kind, puckData, version })), await loadViewScope(trx, { tenantId: input.tenantId, revisionId: revision.id, definitionCode: definition.code, model, interaction }))
        modelFingerprint = fingerprintOnlineModelIR(model)
        viewFingerprint = fingerprintOnlineViews(views)
      } catch (error) {
        throw new ApiError("VALIDATION_ERROR", error instanceof Error ? `Online Draft 无效：${error.message}` : "Online Draft 无效")
      }
      const report = { valid: true, validatedAt: new Date().toISOString(), checks: ["model-ir", "field-index-relation-references", "field-interaction-query-validation-ir", "built-in-action-registry", "puck-view-allowlist", "puck-view-references", `${definition.model_type.toLowerCase()}-semantics`], compilerVersion: "2026-08-15", modelFingerprint, viewFingerprint, warnings: ["动态 DDL apply 与 runtime policy 将在后续阶段单独实现"] }
      await trx.updateTable("online_revision").set({ status: "VALIDATED", validation_report: report, updated_at: new Date() }).where("id", "=", revision.id).execute()
      await trx.updateTable("online_definition").set({ updated_by: input.actorId, updated_at: new Date(), lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).execute()
    })
    return this.detail({ tenantId: input.tenantId, code: input.code })
  }

  static async publish(input: { tenantId: string; actorId: string; code: string; expectedLockVersion: number }): Promise<OnlineDefinitionDetail> {
    requireDatabase()
    const db = await getKyselyDb()
    await db.transaction().execute(async (trx) => {
      const definition = await trx.selectFrom("online_definition").selectAll().where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
      if (!definition || definition.lock_version !== input.expectedLockVersion || !definition.current_draft_revision_id) throw new ApiError("CONFLICT", "Definition 不存在、无 Draft 或版本已过期")
      const revision = await trx.selectFrom("online_revision").selectAll().where("id", "=", definition.current_draft_revision_id).where("tenant_id", "=", input.tenantId).executeTakeFirst()
      if (!revision || revision.status !== "VALIDATED") throw new ApiError("CONFLICT", "仅已校验的 Revision 可以发布")
      const pendingPlan = await trx.selectFrom("online_schema_change").select(["risk", "status"]).where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).where("revision_id", "=", revision.id).where("status", "in", ["REVIEW_REQUIRED", "APPROVED"]).orderBy("created_at", "desc").executeTakeFirst()
      if (pendingPlan && pendingPlan.risk !== "NONE") throw new ApiError("CONFLICT", "Schema Plan 尚未执行；当前阶段仅支持创建和审批计划，不支持发布待迁移模型")
      const last = await trx.selectFrom("online_release").select("release_no").where("tenant_id", "=", input.tenantId).where("definition_id", "=", definition.id).orderBy("release_no", "desc").executeTakeFirst()
      const fields = await trx.selectFrom("online_field").selectAll().where("tenant_id", "=", input.tenantId).where("revision_id", "=", revision.id).where("deleted", "=", false).orderBy("sort", "asc").execute()
      const indexes = await trx.selectFrom("online_index").selectAll().where("tenant_id", "=", input.tenantId).where("revision_id", "=", revision.id).where("deleted", "=", false).orderBy("code", "asc").execute()
      const relations = await trx.selectFrom("online_relation").selectAll().where("tenant_id", "=", input.tenantId).where("revision_id", "=", revision.id).where("deleted", "=", false).orderBy("code", "asc").execute()
      const model = parseOnlineModelIR(revision.model_json)
      const interaction = parseOnlineInteractionIR(revision.interaction_json, model)
      const storedViews = await readViews(trx, input.tenantId, revision.id)
      const actionRows = await trx.selectFrom("online_action").selectAll().where("tenant_id", "=", input.tenantId).where("revision_id", "=", revision.id).where("deleted", "=", false).orderBy("code", "asc").execute()
      const views = compileOnlineViews(storedViews.map(({ code, kind, puckData, version }) => ({ code, kind, puckData, version })), viewScope(definition.code, model, interaction, actionRows))
      const snapshot = { definition: { code: definition.code, name: definition.name, modelType: definition.model_type }, revision: { id: revision.id, sequence: revision.sequence, schemaRevision: revision.schema_revision, model, interaction, fields: fields.map(mapField), indexes: indexes.map(mapIndex), relations: relations.map(mapRelation), views, actions: actionRows.map((action) => ({ code: action.code, type: action.action_type, ...asRecord(action.config) })), policy: revision.policy_json, workflow: revision.workflow_json } }
      const releaseId = crypto.randomUUID()
      await trx.insertInto("online_release").values({ id: releaseId, definition_id: definition.id, revision_id: revision.id, tenant_id: input.tenantId, release_no: (last?.release_no ?? 0) + 1, snapshot_json: snapshot, schema_revision: revision.schema_revision, checksum: checksum(snapshot), released_by: input.actorId, released_at: new Date(), rollback_of_release_id: null }).execute()
      await trx.updateTable("online_revision").set({ status: "PUBLISHED", published_by: input.actorId, published_at: new Date(), updated_at: new Date() }).where("id", "=", revision.id).execute()
      const nextRevisionId = crypto.randomUUID()
      await trx.insertInto("online_revision").values({ id: nextRevisionId, definition_id: definition.id, tenant_id: input.tenantId, sequence: revision.sequence + 1, status: "DRAFT", schema_revision: revision.schema_revision, model_json: revision.model_json, interaction_json: revision.interaction_json, policy_json: revision.policy_json, workflow_json: revision.workflow_json, validation_report: null, created_by: input.actorId, published_by: null, published_at: null, created_at: new Date(), updated_at: new Date() }).execute()
      await syncViews(trx, { tenantId: input.tenantId, revisionId: nextRevisionId, views })
      const nextModel = parseOnlineModelIR(revision.model_json)
      const nextInteraction = parseOnlineInteractionIR(revision.interaction_json, nextModel)
      await syncFieldProjection(trx, { tenantId: input.tenantId, revisionId: nextRevisionId, model: nextModel, interaction: nextInteraction })
      await syncIndexProjection(trx, { tenantId: input.tenantId, revisionId: nextRevisionId, model: nextModel })
      await syncRelationProjection(trx, { tenantId: input.tenantId, revisionId: nextRevisionId, model: nextModel })
      await syncActionProjection(trx, { tenantId: input.tenantId, revisionId: nextRevisionId, interaction: nextInteraction })
      await trx.updateTable("online_definition").set({ status: "ACTIVE", current_draft_revision_id: nextRevisionId, published_release_id: releaseId, updated_by: input.actorId, updated_at: new Date(), lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).execute()
    })
    return this.detail({ tenantId: input.tenantId, code: input.code })
  }

  static async rollback(input: { tenantId: string; actorId: string; code: string; releaseId: string; expectedLockVersion: number }): Promise<OnlineDefinitionDetail> {
    requireDatabase()
    const db = await getKyselyDb()
    const row = await db.transaction().execute(async (trx) => {
      const definition = await trx.selectFrom("online_definition").selectAll().where("tenant_id", "=", input.tenantId).where("code", "=", input.code).where("deleted", "=", false).executeTakeFirst()
      if (!definition || definition.lock_version !== input.expectedLockVersion) throw new ApiError("CONFLICT", "Definition 不存在或版本已过期")
      const release = await trx.selectFrom("online_release").selectAll().where("id", "=", input.releaseId).where("definition_id", "=", definition.id).where("tenant_id", "=", input.tenantId).executeTakeFirst()
      if (!release) throw new ApiError("NOT_FOUND", "目标 Release 不存在")
      return trx.updateTable("online_definition").set({ status: "ACTIVE", published_release_id: release.id, updated_by: input.actorId, updated_at: new Date(), lock_version: definition.lock_version + 1 }).where("id", "=", definition.id).returningAll().executeTakeFirstOrThrow()
    })
    return this.detail({ tenantId: input.tenantId, code: row.code })
  }
}

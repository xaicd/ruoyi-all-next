import { createHash } from "node:crypto"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { parseOnlineInteractionIR } from "./online-interaction.compiler"
import type { OnlineRuntimeRelease } from "./online-runtime.contract"
import { parseOnlineModelIR } from "./online-schema-plan.compiler"
import { compileOnlineViews } from "./online-view.compiler"
import type { OnlineFieldIR } from "./online-schema-plan.contract"

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

export function verifyOnlineReleaseChecksum(snapshot: unknown, expected: string): void {
  const actual = createHash("sha256").update(JSON.stringify(snapshot)).digest("hex")
  if (actual !== expected) throw new ApiError("CONFLICT", "Online Release 快照校验失败")
}

export function compileOnlineRuntimeRelease(row: any): OnlineRuntimeRelease {
  const snapshot = asRecord(row.snapshot_json)
  const definition = asRecord(snapshot.definition)
  const revision = asRecord(snapshot.revision)
  const modelType = definition.modelType
  if (modelType !== "SINGLE" && modelType !== "TREE" && modelType !== "MASTER_DETAIL") throw new ApiError("CONFLICT", "Online Release 模型类型无效")
  const model = parseOnlineModelIR(revision.model)
  const interaction = parseOnlineInteractionIR(revision.interaction, model)
  const rawViews = Array.isArray(revision.views) ? revision.views : []
  const rawActions = Array.isArray(revision.actions) ? revision.actions : []
  const releasedActions = new Set(rawActions.flatMap((action) => typeof action === "string" ? [action] : (action && typeof action === "object" && typeof (action as Record<string, unknown>).code === "string" ? [(action as Record<string, unknown>).code as string] : [])))
  let views
  try { views = compileOnlineViews(rawViews.map((view) => { const item = asRecord(view); return { code: item.code, kind: item.kind, puckData: item.puckData, version: item.version } }), { definitionCode: String(definition.code), fieldCodes: new Set(model.fields.map((field) => field.code)), actionCodes: releasedActions }) } catch (error) { throw new ApiError("CONFLICT", error instanceof Error ? `Online Release 视图无效：${error.message}` : "Online Release 视图无效") }
  return { definitionId: row.definition_id, definitionCode: String(definition.code), definitionName: String(definition.name), modelType, releaseId: row.id, revisionId: row.revision_id, schemaRevision: row.schema_revision, model, interaction, views }
}

function validScalar(field: OnlineFieldIR, value: unknown): boolean {
  if (value === null) return field.nullable
  if (field.type === "string" || field.type === "text") return typeof value === "string" && (!field.length || value.length <= field.length)
  if (field.type === "integer") return typeof value === "number" && Number.isInteger(value)
  if (field.type === "decimal") return typeof value === "number" && Number.isFinite(value)
  if (field.type === "boolean") return typeof value === "boolean"
  if (field.type === "date") return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
  if (field.type === "datetime") return typeof value === "string" && !Number.isNaN(Date.parse(value))
  return value !== undefined
}

export function validateOnlineRuntimeData(runtime: OnlineRuntimeRelease, value: unknown, mode: "CREATE" | "UPDATE"): Record<string, unknown> {
  const data = asRecord(value)
  if (Object.keys(data).length !== Object.keys(value ?? {}).length) throw new ApiError("VALIDATION_ERROR", "记录 data 必须是对象")
  const fields = new Map(runtime.model.fields.map((field) => [field.code, field]))
  const interactions = new Map(runtime.interaction.fields.map((field) => [field.code, field]))
  for (const [code, fieldValue] of Object.entries(data)) {
    const field = fields.get(code)
    if (!field) throw new ApiError("VALIDATION_ERROR", `不允许写入未知字段 ${code}`)
    if (interactions.get(code)?.readOnly) throw new ApiError("FORBIDDEN", `字段 ${code} 为只读字段`)
    if (!validScalar(field, fieldValue)) throw new ApiError("VALIDATION_ERROR", `字段 ${code} 的值与已发布类型不匹配`)
  }
  if (mode === "CREATE") {
    for (const field of runtime.model.fields) {
      if (!field.nullable && field.default === undefined && data[field.code] === undefined) throw new ApiError("VALIDATION_ERROR", `缺少必填字段 ${field.code}`)
    }
    return Object.fromEntries(runtime.model.fields.map((field) => [field.code, data[field.code] === undefined ? (field.default ?? null) : data[field.code]]))
  }
  if (!Object.keys(data).length) throw new ApiError("VALIDATION_ERROR", "更新至少需要一个字段")
  return data
}

import { createHash } from "node:crypto"
import { ApiError } from "@/modules/shared/backend/http/api-error"
import { parseOnlineInteractionIR } from "./online-interaction.compiler"
import type { OnlineRuntimeQueryCondition, OnlineRuntimeRelease } from "./online-runtime.contract"
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
    if (field.systemManaged) throw new ApiError("FORBIDDEN", `系统字段 ${code} 由平台维护`)
    if (interactions.get(code)?.readOnly) throw new ApiError("FORBIDDEN", `字段 ${code} 为只读字段`)
    if (!validScalar(field, fieldValue)) throw new ApiError("VALIDATION_ERROR", `字段 ${code} 的值与已发布类型不匹配`)
  }
  if (mode === "CREATE") {
    for (const field of runtime.model.fields) {
      if (!field.systemManaged && !field.nullable && field.default === undefined && data[field.code] === undefined) throw new ApiError("VALIDATION_ERROR", `缺少必填字段 ${field.code}`)
    }
    return Object.fromEntries(runtime.model.fields.map((field) => [field.code, field.systemManaged ? (field.default ?? null) : data[field.code] === undefined ? (field.default ?? null) : data[field.code]]))
  }
  if (!Object.keys(data).length) throw new ApiError("VALIDATION_ERROR", "更新至少需要一个字段")
  return data
}


type CompiledQueryCondition = { field: string; operator: "EQ" | "NE" | "LIKE" | "IN" | "GT" | "GTE" | "LT" | "LTE" | "BETWEEN"; value: string | number | boolean | null | Array<string | number | boolean | null> }

function coerceQueryValue(field: OnlineFieldIR, value: unknown): string | number | boolean | null {
  if (value === null) return null
  if (field.type === "boolean") { if (value === true || value === "true") return true; if (value === false || value === "false") return false; throw new ApiError("VALIDATION_ERROR", `查询字段 ${field.code} 必须为布尔值`) }
  if (field.type === "integer" || field.type === "decimal") { const number = typeof value === "number" ? value : Number(value); if (!Number.isFinite(number) || (field.type === "integer" && !Number.isInteger(number))) throw new ApiError("VALIDATION_ERROR", `查询字段 ${field.code} 必须为${field.type === "integer" ? "整数" : "数字"}`); return number }
  if (typeof value !== "string") throw new ApiError("VALIDATION_ERROR", `查询字段 ${field.code} 必须为文本`)
  if (field.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new ApiError("VALIDATION_ERROR", `查询字段 ${field.code} 必须为 YYYY-MM-DD 日期`)
  if (field.type === "datetime" && Number.isNaN(Date.parse(value))) throw new ApiError("VALIDATION_ERROR", `查询字段 ${field.code} 必须为有效日期时间`)
  return value
}

export function compileOnlineRuntimeQueryConditions(runtime: OnlineRuntimeRelease, input: OnlineRuntimeQueryCondition[]): CompiledQueryCondition[] {
  const fields = new Map(runtime.model.fields.map((field) => [field.code, field]))
  const configured = new Map(runtime.interaction.fields.filter((field) => field.query.enabled).map((field) => [field.code, field]))
  const supplied = new Map(input.map((condition) => [condition.field, condition.value]))
  if (supplied.size !== input.length) throw new ApiError("VALIDATION_ERROR", "查询条件字段不可重复")
  for (const code of supplied.keys()) if (!configured.has(code)) throw new ApiError("FORBIDDEN", `字段 ${code} 未在当前 Release 中启用查询`)
  const compiled: CompiledQueryCondition[] = []
  for (const [code, config] of configured) {
    const raw = supplied.has(code) ? supplied.get(code) : config.query.defaultValue
    if (raw === undefined || raw === "") {
      if (config.query.required) throw new ApiError("VALIDATION_ERROR", `查询字段 ${code} 为必填条件`)
      continue
    }
    const field = fields.get(code)!
    const operator = config.query.operator!
    const values = Array.isArray(raw) ? raw : operator === "IN" || operator === "BETWEEN" ? String(raw).split(",").map((value) => value.trim()).filter(Boolean) : [raw]
    if ((operator === "BETWEEN" && values.length !== 2) || (operator === "IN" && !values.length) || (!["BETWEEN", "IN"].includes(operator) && values.length !== 1)) throw new ApiError("VALIDATION_ERROR", `查询字段 ${code} 的 ${operator} 条件值数量无效`)
    const parsed = values.map((value) => coerceQueryValue(field, value))
    compiled.push({ field: code, operator, value: operator === "IN" || operator === "BETWEEN" ? parsed : parsed[0] })
  }
  return compiled
}

function compareQueryValues(left: unknown, right: unknown): number | null {
  if (typeof left === "number" && typeof right === "number") return left - right
  if (typeof left === "boolean" && typeof right === "boolean") return Number(left) - Number(right)
  if (typeof left === "string" && typeof right === "string") return left.localeCompare(right)
  return null
}

export function matchesOnlineRuntimeQueryConditions(data: Record<string, unknown>, conditions: CompiledQueryCondition[]): boolean {
  return conditions.every((condition) => {
    const value = data[condition.field]
    if (condition.operator === "EQ") return value === condition.value
    if (condition.operator === "NE") return value !== condition.value
    if (condition.operator === "LIKE") return typeof value === "string" && typeof condition.value === "string" && value.toLowerCase().includes(condition.value.toLowerCase())
    if (condition.operator === "IN") return Array.isArray(condition.value) && condition.value.includes(value as never)
    if (condition.operator === "BETWEEN") { if (!Array.isArray(condition.value)) return false; const lower = compareQueryValues(value, condition.value[0]); const upper = compareQueryValues(value, condition.value[1]); return lower !== null && upper !== null && lower >= 0 && upper <= 0 }
    const compared = compareQueryValues(value, condition.value)
    return compared !== null && (condition.operator === "GT" ? compared > 0 : condition.operator === "GTE" ? compared >= 0 : condition.operator === "LT" ? compared < 0 : compared <= 0)
  })
}

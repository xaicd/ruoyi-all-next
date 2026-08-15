import { createHash } from "node:crypto"
import { z } from "zod"
import {
  ONLINE_SCALAR_TYPES,
  ONLINE_STORAGE_KINDS,
  type OnlineFieldIR,
  type OnlineIndexIR,
  type OnlineModelIR,
  type OnlineSchemaOperation,
  type OnlineSchemaPlanPayload,
  type OnlineSchemaRisk,
} from "./online-schema-plan.contract"

const code = z.string().regex(/^[a-z][a-z0-9_]{1,63}$/, "标识必须以小写字母开头，仅允许小写字母、数字和下划线")
const fieldSchema = z.object({
  code,
  type: z.enum(ONLINE_SCALAR_TYPES),
  nullable: z.boolean().default(true),
  length: z.number().int().min(1).max(65535).optional(),
  default: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
}).strict()
const indexSchema = z.object({ code, fields: z.array(code).min(1).max(16), unique: z.boolean().default(false) }).strict()
export const onlineModelIrSchema = z.object({
  version: z.literal(1).default(1),
  storage: z.object({ kind: z.enum(ONLINE_STORAGE_KINDS).default("GENERIC_RECORD") }).strict().default({ kind: "GENERIC_RECORD" }),
  fields: z.array(fieldSchema).max(128).default([]),
  indexes: z.array(indexSchema).max(64).default([]),
}).strict()

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`
  if (value && typeof value === "object") return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${JSON.stringify(key)}:${stable((value as Record<string, unknown>)[key])}`).join(",")}}`
  return JSON.stringify(value)
}
function hash(value: unknown): string { return createHash("sha256").update(stable(value)).digest("hex") }
function same(left: unknown, right: unknown): boolean { return stable(left) === stable(right) }
function unique<T extends { code: string }>(items: T[], label: string): void {
  if (new Set(items.map((item) => item.code)).size !== items.length) throw new Error(`${label} code 不可重复`)
}
function toRecord(value: OnlineFieldIR | OnlineIndexIR): Record<string, unknown> { return value as Record<string, unknown> }
function maxRisk(risks: OnlineSchemaRisk[]): OnlineSchemaRisk {
  return ["UNSUPPORTED", "DESTRUCTIVE", "REVIEW_REQUIRED", "SAFE", "NONE"].find((risk) => risks.includes(risk as OnlineSchemaRisk)) as OnlineSchemaRisk
}

export function parseOnlineModelIR(value: unknown): OnlineModelIR {
  const parsed = onlineModelIrSchema.parse(value ?? {}) as OnlineModelIR
  unique(parsed.fields, "字段")
  unique(parsed.indexes, "索引")
  const fieldCodes = new Set(parsed.fields.map((field) => field.code))
  for (const index of parsed.indexes) {
    if (new Set(index.fields).size !== index.fields.length) throw new Error(`索引 ${index.code} 不可重复引用同一字段`)
    for (const field of index.fields) if (!fieldCodes.has(field)) throw new Error(`索引 ${index.code} 引用了不存在字段 ${field}`)
  }
  return {
    ...parsed,
    fields: [...parsed.fields].sort((a, b) => a.code.localeCompare(b.code)),
    indexes: [...parsed.indexes].map((index) => ({ ...index, fields: [...index.fields] })).sort((a, b) => a.code.localeCompare(b.code)),
  }
}

export function fingerprintOnlineModelIR(value: unknown): string { return hash(parseOnlineModelIR(value)) }

function fieldRisk(before: OnlineFieldIR, after: OnlineFieldIR): { risk: OnlineSchemaRisk; reasons: string[] } {
  if (before.type !== after.type) return { risk: "REVIEW_REQUIRED", reasons: ["字段类型变更需要人工确认数据兼容性"] }
  if (before.nullable && !after.nullable) return { risk: "DESTRUCTIVE", reasons: ["字段从可空变为必填可能拒绝现有数据"] }
  if ((before.length ?? Number.POSITIVE_INFINITY) > (after.length ?? Number.POSITIVE_INFINITY)) return { risk: "DESTRUCTIVE", reasons: ["字段长度缩小可能截断现有数据"] }
  return { risk: "REVIEW_REQUIRED", reasons: ["字段属性变更需要人工确认"] }
}

function storageRisk(baseline: OnlineModelIR, target: OnlineModelIR): { risk: OnlineSchemaRisk; reasons: string[] } | null {
  if (baseline.storage.kind === target.storage.kind && target.storage.kind === "GENERIC_RECORD") return null
  return { risk: "UNSUPPORTED", reasons: ["当前阶段仅支持 GENERIC_RECORD 的计划评估，不允许迁移存储实现"] }
}

export function buildOnlineSchemaPlan(baselineInput: unknown, targetInput: unknown): { risk: OnlineSchemaRisk; payload: OnlineSchemaPlanPayload } {
  const baseline = parseOnlineModelIR(baselineInput)
  const target = parseOnlineModelIR(targetInput)
  const operations: OnlineSchemaOperation[] = []
  const risks: OnlineSchemaRisk[] = []
  const storage = storageRisk(baseline, target)
  if (storage) {
    operations.push({ kind: "ALTER_FIELD", subject: "storage", before: { kind: baseline.storage.kind }, after: { kind: target.storage.kind }, reasons: storage.reasons })
    risks.push(storage.risk)
  }

  const baselineFields = new Map(baseline.fields.map((field) => [field.code, field]))
  const targetFields = new Map(target.fields.map((field) => [field.code, field]))
  for (const field of target.fields) {
    const before = baselineFields.get(field.code)
    if (!before) {
      const risk: OnlineSchemaRisk = field.nullable ? "SAFE" : "REVIEW_REQUIRED"
      operations.push({ kind: "ADD_FIELD", subject: field.code, after: toRecord(field), reasons: [field.nullable ? "新增可空字段" : "新增必填字段需要确认现有数据填充策略"] })
      risks.push(risk)
    } else if (!same(before, field)) {
      const classified = fieldRisk(before, field)
      operations.push({ kind: "ALTER_FIELD", subject: field.code, before: toRecord(before), after: toRecord(field), reasons: classified.reasons })
      risks.push(classified.risk)
    }
  }

  const baselineIndexes = new Map(baseline.indexes.map((index) => [index.code, index]))
  const targetIndexes = new Map(target.indexes.map((index) => [index.code, index]))
  for (const index of target.indexes) {
    const before = baselineIndexes.get(index.code)
    if (!before) {
      const risk: OnlineSchemaRisk = index.unique ? "REVIEW_REQUIRED" : "SAFE"
      operations.push({ kind: "ADD_INDEX", subject: index.code, after: toRecord(index), reasons: [index.unique ? "新增唯一索引需要确认既有数据唯一性" : "新增非唯一索引"] })
      risks.push(risk)
    } else if (!same(before, index)) {
      operations.push({ kind: "DROP_INDEX", subject: index.code, before: toRecord(before), reasons: ["替换索引前需要人工确认影响"] })
      operations.push({ kind: "ADD_INDEX", subject: index.code, after: toRecord(index), reasons: ["替换索引需要人工确认"] })
      risks.push("REVIEW_REQUIRED")
    }
  }
  for (const index of baseline.indexes) if (!targetIndexes.has(index.code)) {
    operations.push({ kind: "DROP_INDEX", subject: index.code, before: toRecord(index), reasons: ["删除索引可能影响查询性能或约束"] })
    risks.push("DESTRUCTIVE")
  }
  for (const field of baseline.fields) if (!targetFields.has(field.code)) {
    operations.push({ kind: "DROP_FIELD", subject: field.code, before: toRecord(field), reasons: ["删除字段可能丢失数据"] })
    risks.push("DESTRUCTIVE")
  }
  if (!operations.length) operations.push({ kind: "NO_OP", subject: "model", reasons: ["模型结构未变化"] })

  return {
    risk: maxRisk(risks.length ? risks : ["NONE"]),
    payload: {
      formatVersion: 1,
      classifierVersion: "2026-08-15",
      baseline,
      target,
      sourceFingerprint: hash(baseline),
      targetFingerprint: hash(target),
      operations,
    },
  }
}

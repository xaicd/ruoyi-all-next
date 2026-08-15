export const ONLINE_STORAGE_KINDS = ["GENERIC_RECORD", "MANAGED_TABLE"] as const
export const ONLINE_SCALAR_TYPES = ["string", "text", "integer", "decimal", "boolean", "date", "datetime", "json"] as const
export const ONLINE_SCHEMA_RISKS = ["NONE", "SAFE", "REVIEW_REQUIRED", "DESTRUCTIVE", "UNSUPPORTED"] as const
export const ONLINE_SCHEMA_PLAN_STATUSES = ["DRAFT", "REVIEW_REQUIRED", "APPROVED", "APPLYING", "APPLIED", "FAILED", "SUPERSEDED"] as const

export type OnlineStorageKind = (typeof ONLINE_STORAGE_KINDS)[number]
export type OnlineScalarType = (typeof ONLINE_SCALAR_TYPES)[number]
export type OnlineSchemaRisk = (typeof ONLINE_SCHEMA_RISKS)[number]
export type OnlineSchemaPlanStatus = (typeof ONLINE_SCHEMA_PLAN_STATUSES)[number]

export type OnlineIdentityStrategy = "PLATFORM_UUID" | "MANUAL"
export type OnlineRelationType = "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_ONE"
export type OnlineFieldIR = {
  code: string; type: OnlineScalarType; nullable: boolean; length?: number; precision?: number
  default?: string | number | boolean | null; remark?: string; identity?: OnlineIdentityStrategy; systemTemplate?: "CREATED_AUDIT" | "UPDATED_AUDIT"; systemManaged?: boolean
}
export type OnlineIndexIR = { code: string; fields: string[]; unique: boolean }
export type OnlineRelationIR = {
  code: string; type: OnlineRelationType; sourceField: string; targetDefinitionCode: string
  /** Immutable same-tenant Online Release selected by the server during Draft normalization. */
  targetReleaseId?: string
  targetField: string; onDelete: "RESTRICT" | "SET_NULL"
}
export type OnlineModelIR = { version: 1; storage: { kind: OnlineStorageKind }; fields: OnlineFieldIR[]; indexes: OnlineIndexIR[]; relations: OnlineRelationIR[] }
export type OnlineSchemaOperationKind = "ADD_FIELD" | "ALTER_FIELD" | "DROP_FIELD" | "ADD_INDEX" | "DROP_INDEX" | "NO_OP"
export type OnlineSchemaOperation = { kind: OnlineSchemaOperationKind; subject: string; before?: Record<string, unknown>; after?: Record<string, unknown>; reasons: string[] }
export type OnlineSchemaPlanPayload = {
  formatVersion: 1
  classifierVersion: "2026-08-15"
  baseline: OnlineModelIR
  target: OnlineModelIR
  sourceFingerprint: string
  targetFingerprint: string
  operations: OnlineSchemaOperation[]
}
export type OnlineSchemaPlanSummary = {
  id: string; definitionId: string; revisionId: string; risk: OnlineSchemaRisk; status: OnlineSchemaPlanStatus
  expectedSchemaRevision: number; appliedSchemaRevision: number | null; sourceFingerprint: string; targetFingerprint: string
  operations: OnlineSchemaOperation[]; approval: Record<string, unknown> | null; createdAt: string; updatedAt: string
}

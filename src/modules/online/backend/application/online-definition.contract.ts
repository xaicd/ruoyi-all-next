export const ONLINE_MODEL_TYPES = ["SINGLE", "TREE", "MASTER_DETAIL"] as const
export type OnlineModelType = (typeof ONLINE_MODEL_TYPES)[number]
export type OnlineDefinitionStatus = "DRAFT" | "ACTIVE" | "ARCHIVED"
export type OnlineRevisionStatus = "DRAFT" | "VALIDATED" | "PUBLISHED" | "ARCHIVED"

export type OnlineDefinitionReleaseSummary = {
  id: string
  releaseNo: number
  schemaRevision: number
  releasedAt: string
}

/** Latest generated plan only; it does not indicate that physical database DDL was applied. */
export type OnlineDefinitionSchemaPlanSummary = {
  id: string
  risk: "NONE" | "SAFE" | "REVIEW_REQUIRED" | "DESTRUCTIVE" | "UNSUPPORTED"
  status: "DRAFT" | "REVIEW_REQUIRED" | "APPROVED" | "APPLYING" | "APPLIED" | "FAILED" | "SUPERSEDED"
  expectedSchemaRevision: number
  appliedSchemaRevision: number | null
  createdAt: string
  updatedAt: string
}

export type OnlineDefinitionSummary = {
  id: string
  code: string
  name: string
  modelType: OnlineModelType
  status: OnlineDefinitionStatus
  lockVersion: number
  currentDraftRevisionId: string | null
  publishedReleaseId: string | null
  currentRelease: OnlineDefinitionReleaseSummary | null
  latestSchemaPlan: OnlineDefinitionSchemaPlanSummary | null
  createdAt: string
  updatedAt: string
}

export type OnlineFieldDetail = {
  code: string
  label: string
  fieldType: string
  required: boolean
  length: number | null
  sort: number
  defaultValue: string | null
  config: Record<string, unknown>
}

export type OnlineIndexDetail = { code: string; fields: string[]; unique: boolean }
export type OnlineRelationDetail = {
  code: string; type: "ONE_TO_ONE" | "ONE_TO_MANY" | "MANY_TO_ONE"; sourceField: string
  targetDefinitionCode: string; targetReleaseId?: string; targetField: string; onDelete: "RESTRICT" | "SET_NULL"
}

export type OnlineViewDetail = {
  code: "list" | "form" | "detail" | "dashboard"
  kind: "PUCK"
  puckData: Record<string, unknown>
  componentConfig: { configVersion: 1 }
  version: 1
}

export type OnlineRevisionDetail = {
  id: string
  definitionId: string
  sequence: number
  status: OnlineRevisionStatus
  schemaRevision: number
  model: Record<string, unknown>
  interaction: Record<string, unknown>
  policy: Record<string, unknown>
  workflow: Record<string, unknown>
  fields: OnlineFieldDetail[]
  indexes: OnlineIndexDetail[]
  relations: OnlineRelationDetail[]
  views: OnlineViewDetail[]
  validationReport: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export type OnlineReleaseSummary = {
  id: string
  releaseNo: number
  revisionId: string
  schemaRevision: number
  checksum: string
  releasedAt: string
  rollbackOfReleaseId: string | null
}

export type OnlineDefinitionDetail = OnlineDefinitionSummary & {
  revision: OnlineRevisionDetail | null
  releases: OnlineReleaseSummary[]
}

export type OnlineDefinitionPage = {
  items: OnlineDefinitionSummary[]
  total: number
  page: number
  pageSize: number
  phase: "METADATA_READY"
  persistence: "POSTGRESQL_REQUIRED"
}

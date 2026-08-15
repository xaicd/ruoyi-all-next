export const ONLINE_MODEL_TYPES = ["SINGLE", "TREE", "MASTER_DETAIL"] as const
export type OnlineModelType = (typeof ONLINE_MODEL_TYPES)[number]
export type OnlineDefinitionStatus = "DRAFT" | "ACTIVE" | "ARCHIVED"
export type OnlineRevisionStatus = "DRAFT" | "VALIDATED" | "PUBLISHED" | "ARCHIVED"

export type OnlineDefinitionSummary = {
  id: string
  code: string
  name: string
  modelType: OnlineModelType
  status: OnlineDefinitionStatus
  lockVersion: number
  currentDraftRevisionId: string | null
  publishedReleaseId: string | null
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

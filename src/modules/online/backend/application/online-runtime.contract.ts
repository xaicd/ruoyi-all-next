import type { OnlineModelIR } from "./online-schema-plan.contract"
import type { OnlineInteractionIR } from "./online-interaction.compiler"
import type { OnlineViewDetail } from "./online-definition.contract"

export type OnlineRuntimeKind = "SINGLE_DEFAULT" | "TREE_DEFAULT" | "MASTER_DETAIL_ERP" | "MASTER_DETAIL_INNER" | "MASTER_DETAIL_TAB"

export type OnlineRuntimeRelease = {
  definitionId: string
  definitionCode: string
  definitionName: string
  modelType: "SINGLE" | "TREE" | "MASTER_DETAIL"
  releaseId: string
  revisionId: string
  schemaRevision: number
  model: OnlineModelIR
  interaction: OnlineInteractionIR
  views: OnlineViewDetail[]
}

export type OnlineRuntimeView = Pick<OnlineRuntimeRelease, "definitionCode" | "definitionName" | "modelType" | "releaseId" | "schemaRevision" | "model" | "interaction" | "views"> & {
  kind: OnlineRuntimeKind
}

export type OnlineTestSessionSummary = {
  id: string
  definitionCode: string
  releaseId: string
  schemaRevision: number
  sandbox: boolean
  startedAt: string
}

export type OnlineRuntimeRecord = {
  id: string
  sessionId: string
  releaseId: string
  schemaRevision: number
  data: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type OnlineRuntimeQueryCondition = {
  field: string
  value: string | number | boolean | null | Array<string | number | boolean | null>
}

export type OnlineRuntimeRecordPage = {
  items: OnlineRuntimeRecord[]
  total: number
  page: number
  pageSize: number
}

export type OnlineRuntimeChildBinding = {
  code: string
  targetDefinitionCode: string
  foreignKeyField: string
  display: "TABLE" | "TABS"
  runtime: OnlineRuntimeView
}

export type OnlineTestSessionDetail = OnlineTestSessionSummary & {
  runtime: OnlineRuntimeView
  children: OnlineRuntimeChildBinding[]
}

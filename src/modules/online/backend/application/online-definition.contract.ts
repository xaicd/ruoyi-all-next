export type OnlineDefinitionPhase = "CONTRACT_BASELINE" | "METADATA_READY" | "RUNTIME_READY"

export type OnlineDefinitionSummary = {
  id: string
  code: string
  name: string
  modelType: "SINGLE" | "TREE" | "MASTER_DETAIL"
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
  updatedAt: string
}

export type OnlineDefinitionPage = {
  items: OnlineDefinitionSummary[]
  total: number
  page: number
  pageSize: number
  phase: OnlineDefinitionPhase
  persistence: "PENDING_PRISMA_MIGRATION"
}

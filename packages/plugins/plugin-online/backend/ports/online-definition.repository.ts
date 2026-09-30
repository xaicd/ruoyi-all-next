import type { OnlineDefinitionPage, OnlineDefinitionSummary } from "../application/online-definition.contract"

export type OnlineDefinitionRepository = {
  page(input: { tenantId: string; page: number; pageSize: number }): Promise<Omit<OnlineDefinitionPage, "phase" | "persistence">>
  findByCode(input: { tenantId: string; code: string }): Promise<OnlineDefinitionSummary | null>
}

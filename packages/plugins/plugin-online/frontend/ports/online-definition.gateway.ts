import type { OnlineDefinitionPage } from "../../backend/application/online-definition.contract"

export type OnlineDefinitionGateway = {
  page(params?: { page?: number; pageSize?: number }): Promise<OnlineDefinitionPage>
}

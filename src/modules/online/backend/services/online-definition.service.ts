import type { OnlineDefinitionPage } from "../application/online-definition.contract"
import type { OnlineDefinitionPageInput } from "../validators"

/**
 * Phase-1 capability boundary. Definition persistence is introduced only with
 * the tenant-scoped Prisma migration in the next implementation phase.
 */
export class OnlineDefinitionService {
  static async page(input: OnlineDefinitionPageInput): Promise<OnlineDefinitionPage> {
    return {
      items: [],
      total: 0,
      page: input.page,
      pageSize: input.pageSize,
      phase: "CONTRACT_BASELINE",
      persistence: "PENDING_PRISMA_MIGRATION",
    }
  }
}

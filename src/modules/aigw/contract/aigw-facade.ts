/**
 * Aigw Domain Facade - Dual-mode (In-process SDK / Split RPC)
 */

import { makeDomainFacade } from "@/modules/shared/backend/lib/domain-facade"

export type AigwPublicFacade = {
  relayChat(input: {
    apiKey: string
    model: string
    messages: { role: string; content: string }[]
    stream?: boolean
  }): Promise<any>
  listModels(input?: { keyword?: string }): Promise<any>
}

export const aigwPublicFacade = makeDomainFacade<AigwPublicFacade>("aigw", {
  async relayChat(input) {
    const { AigwRelayService } = await import("@/modules/aigw/backend/services/aigw-relay.service")
    return AigwRelayService.relayChatCompletion(input)
  },
  async listModels(input) {
    const { AigwModelService } = await import("@/modules/aigw/backend/services/aigw-model.service")
    return AigwModelService.page({ page: 1, pageSize: 100, keyword: input?.keyword })
  },
})

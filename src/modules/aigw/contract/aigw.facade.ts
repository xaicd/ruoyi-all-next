import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const AIGW_FACADE_METHODS = ["ping", "listChannels", "createChannel", "listTokens", "createToken", "listModels", "relayChat"] as const

export const aigwFacade = createDomainFacade("aigw", AIGW_FACADE_METHODS)

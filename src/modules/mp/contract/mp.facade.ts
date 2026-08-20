import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const MP_FACADE_METHODS = ["ping", "listAccounts", "listFans", "sendMessage"] as const

export const mpFacade = createDomainFacade("mp", MP_FACADE_METHODS)

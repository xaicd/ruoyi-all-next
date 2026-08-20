import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const IM_FACADE_METHODS = ["ping", "listConversations", "auditMessage"] as const

export const imFacade = createDomainFacade("im", IM_FACADE_METHODS)

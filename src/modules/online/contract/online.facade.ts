import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const ONLINE_FACADE_METHODS = ["ping", "pageDefinitions"] as const

export const onlineFacade = createDomainFacade("online", ONLINE_FACADE_METHODS)

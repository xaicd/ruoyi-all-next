import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const SYSTEM_FACADE_METHODS = ["ping"] as const

export const systemFacade = createDomainFacade("system", SYSTEM_FACADE_METHODS)

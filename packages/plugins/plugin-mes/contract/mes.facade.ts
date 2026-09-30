import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const MES_FACADE_METHODS = ["ping", "listWorkOrders", "reportWork"] as const

export const mesFacade = createDomainFacade("mes", MES_FACADE_METHODS)

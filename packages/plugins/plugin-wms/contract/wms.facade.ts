import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const WMS_FACADE_METHODS = ["ping", "listWarehouses", "checkin", "deductStock", "lockStock", "releaseStock", "replenishStock"] as const

export const wmsFacade = createDomainFacade("wms", WMS_FACADE_METHODS)

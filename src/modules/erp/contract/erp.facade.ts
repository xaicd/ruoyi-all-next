import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const ERP_FACADE_METHODS = ["ping", "listProducts", "listOrders", "adjustStock"] as const

export const erpFacade = createDomainFacade("erp", ERP_FACADE_METHODS)

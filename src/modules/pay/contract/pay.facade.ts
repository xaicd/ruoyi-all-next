import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const PAY_FACADE_METHODS = ["ping", "listOrders", "createOrder", "createRefund"] as const

export const payFacade = createDomainFacade("pay", PAY_FACADE_METHODS)

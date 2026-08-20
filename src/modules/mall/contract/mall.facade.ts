import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const MALL_FACADE_METHODS = ["ping", "listProducts", "listOrders", "issueCoupon"] as const

export const mallFacade = createDomainFacade("mall", MALL_FACADE_METHODS)

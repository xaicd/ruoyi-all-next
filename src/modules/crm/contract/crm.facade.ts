import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const CRM_FACADE_METHODS = ["ping", "listCustomers", "listClues", "createFollowup"] as const

export const crmFacade = createDomainFacade("crm", CRM_FACADE_METHODS)

import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const MEMBER_FACADE_METHODS = ["ping", "listUsers", "updateUser", "listLevels", "createLevel", "listPoints", "adjustPoint"] as const

export const memberFacade = createDomainFacade("member", MEMBER_FACADE_METHODS)

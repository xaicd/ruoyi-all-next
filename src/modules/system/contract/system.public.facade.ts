// Business-domain public RPC. Do not add admin CRUD here.
import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const SYSTEM_PUBLIC_METHODS = ["getDictDataByType", "getPermissionInfoByUser"] as const

export const systemPublicFacade = createDomainFacade("system", SYSTEM_PUBLIC_METHODS)

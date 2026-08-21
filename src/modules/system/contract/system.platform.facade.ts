// Platform collaboration RPC for shared/online/report. Not a public business API.
import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const SYSTEM_PLATFORM_METHODS = ["ping", "resolveTenantEntitlement", "getDictDataByType", "getPermissionInfoByUser"] as const

export const systemPlatformFacade = createDomainFacade("system", SYSTEM_PLATFORM_METHODS)

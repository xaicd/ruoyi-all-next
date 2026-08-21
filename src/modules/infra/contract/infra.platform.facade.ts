// Platform collaboration RPC for shared/online/report. Not a public business API.
import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const INFRA_PLATFORM_METHODS = ["ping", "previewCodegen", "generateCodegen", "previewTemplate", "generateTemplate", "listQueryDataSources", "getQueryConnection"] as const

export const infraPlatformFacade = createDomainFacade("infra", INFRA_PLATFORM_METHODS)

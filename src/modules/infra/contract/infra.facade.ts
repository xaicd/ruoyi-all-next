import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const INFRA_FACADE_METHODS = ["ping", "updateConfig", "previewCodegen", "generateCodegen", "previewTemplate", "generateTemplate"] as const

export const infraFacade = createDomainFacade("infra", INFRA_FACADE_METHODS)

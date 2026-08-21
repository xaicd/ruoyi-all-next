import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const ONLINE_FACADE_METHODS = ["ping", "pageDefinitions", "resolvePublishedRelease", "resolveCodegenImport", "pageManagedRecords", "getManagedRecord", "createManagedRecord", "updateManagedRecord", "deleteManagedRecord"] as const

export const onlineFacade = createDomainFacade("online", ONLINE_FACADE_METHODS)

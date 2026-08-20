import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const BPM_FACADE_METHODS = ["ping", "listDefinitions", "listTasks", "actionTask"] as const

export const bpmFacade = createDomainFacade("bpm", BPM_FACADE_METHODS)

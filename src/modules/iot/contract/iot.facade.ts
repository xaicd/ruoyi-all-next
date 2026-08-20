import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const IOT_FACADE_METHODS = ["ping", "listDevices", "createDevice", "listAlerts", "handleAlert"] as const

export const iotFacade = createDomainFacade("iot", IOT_FACADE_METHODS)

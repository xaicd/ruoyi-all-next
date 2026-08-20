import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const REPORT_FACADE_METHODS = ["ping", "listBoards", "exportBoard"] as const

export const reportFacade = createDomainFacade("report", REPORT_FACADE_METHODS)

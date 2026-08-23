import { createDomainFacade } from "@/modules/shared/backend/lib/rpc-facade"

export const AI_FACADE_METHODS = [
  "ping",
  "listModels",
  "createModel",
  "listChats",
  "deleteChat",
  "relayChatCompletion",
  "listPublicModels",
] as const

export const aiFacade = createDomainFacade("ai", AI_FACADE_METHODS)

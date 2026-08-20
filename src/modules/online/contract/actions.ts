import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  onlineDefinitionPageSchema,
} from "../backend/validators"

export const onlinePingSchema = z.object({
  n: z.number().optional(),
})

export const ONLINE_ACTION_SCHEMAS = {
  "online.ping": onlinePingSchema,
  "online.pageDefinitions": onlineDefinitionPageSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(ONLINE_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"

export const systemPingSchema = z.object({
  n: z.number().optional(),
})

export const SYSTEM_ACTION_SCHEMAS = {
  "system.ping": systemPingSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(SYSTEM_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

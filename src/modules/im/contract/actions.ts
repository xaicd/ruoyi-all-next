import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  imPageQuerySchema,
  imMessageAuditSchema,
} from "../backend/validators"

export const imPingSchema = z.object({
  n: z.number().optional(),
})

export const IM_ACTION_SCHEMAS = {
  "im.ping": imPingSchema,
  "im.listConversations": imPageQuerySchema,
  "im.auditMessage": imMessageAuditSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(IM_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

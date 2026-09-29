import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  crmPageQuerySchema,
  crmFollowupSchema,
} from "../backend/validators"

export const crmPingSchema = z.object({
  n: z.number().optional(),
})

export const CRM_ACTION_SCHEMAS = {
  "crm.ping": crmPingSchema,
  "crm.listCustomers": crmPageQuerySchema,
  "crm.listClues": crmPageQuerySchema,
  "crm.createFollowup": crmFollowupSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(CRM_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

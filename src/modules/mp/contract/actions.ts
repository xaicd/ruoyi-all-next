import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  mpPageQuerySchema,
  mpSendMessageSchema,
} from "../backend/validators"

export const mpPingSchema = z.object({
  n: z.number().optional(),
})

export const MP_ACTION_SCHEMAS = {
  "mp.ping": mpPingSchema,
  "mp.listAccounts": mpPageQuerySchema,
  "mp.listFans": mpPageQuerySchema,
  "mp.sendMessage": mpSendMessageSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(MP_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

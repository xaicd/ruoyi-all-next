import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  getDictDataByTypeSchema,
  resolveTenantEntitlementSchema,
} from "../backend/validators"

export const systemPingSchema = z.object({
  n: z.number().optional(),
})

export const SYSTEM_ACTION_SCHEMAS = {
  "system.ping": systemPingSchema,
  "system.getDictDataByType": getDictDataByTypeSchema,
  "system.resolveTenantEntitlement": resolveTenantEntitlementSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(SYSTEM_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

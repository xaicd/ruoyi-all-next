import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  wmsPageQuerySchema,
  wmsCheckinSchema,
} from "../backend/validators"

export const wmsPingSchema = z.object({
  n: z.number().optional(),
})

export const WMS_ACTION_SCHEMAS = {
  "wms.ping": wmsPingSchema,
  "wms.listWarehouses": wmsPageQuerySchema,
  "wms.checkin": wmsCheckinSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(WMS_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

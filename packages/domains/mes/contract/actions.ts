import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  mesPageQuerySchema,
  mesReportWorkSchema,
} from "../backend/validators"

export const mesPingSchema = z.object({
  n: z.number().optional(),
})

export const MES_ACTION_SCHEMAS = {
  "mes.ping": mesPingSchema,
  "mes.listWorkOrders": mesPageQuerySchema,
  "mes.reportWork": mesReportWorkSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(MES_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

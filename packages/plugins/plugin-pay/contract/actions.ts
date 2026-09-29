import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  payPageQuerySchema,
  payOrderCreateSchema,
  payRefundCreateSchema,
  payRefundPageQuerySchema,
} from "../backend/validators"

export const payPingSchema = z.object({
  n: z.number().optional(),
})

export const PAY_ACTION_SCHEMAS = {
  "pay.ping": payPingSchema,
  "pay.listOrders": payPageQuerySchema,
  "pay.createOrder": payOrderCreateSchema,
  "pay.createRefund": payRefundCreateSchema,
  "pay.listRefunds": payRefundPageQuerySchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(PAY_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

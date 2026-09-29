import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  erpPageQuerySchema,
  erpStockAdjustmentSchema,
} from "../backend/validators"

export const erpPingSchema = z.object({
  n: z.number().optional(),
})

export const ERP_ACTION_SCHEMAS = {
  "erp.ping": erpPingSchema,
  "erp.listProducts": erpPageQuerySchema,
  "erp.listOrders": erpPageQuerySchema,
  "erp.adjustStock": erpStockAdjustmentSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(ERP_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

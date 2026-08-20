import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  mallPageQuerySchema,
  mallCouponIssueSchema,
} from "../backend/validators"

export const mallPingSchema = z.object({
  n: z.number().optional(),
})

export const MALL_ACTION_SCHEMAS = {
  "mall.ping": mallPingSchema,
  "mall.listProducts": mallPageQuerySchema,
  "mall.listOrders": mallPageQuerySchema,
  "mall.issueCoupon": mallCouponIssueSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(MALL_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

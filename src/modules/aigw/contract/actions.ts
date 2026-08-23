import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  aigwPageQuerySchema,
  aigwChannelCreateSchema,
  aigwTokenCreateSchema,
  aigwRelayChatSchema,
} from "../backend/validators"

export const aigwPingSchema = z.object({
  n: z.number().optional(),
})

export const AIGW_ACTION_SCHEMAS = {
  "aigw.ping": aigwPingSchema,
  "aigw.listChannels": aigwPageQuerySchema,
  "aigw.createChannel": aigwChannelCreateSchema,
  "aigw.listTokens": aigwPageQuerySchema,
  "aigw.createToken": aigwTokenCreateSchema,
  "aigw.listModels": aigwPageQuerySchema,
  "aigw.relayChat": aigwRelayChatSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(AIGW_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

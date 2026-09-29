import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  iotPageQuerySchema,
  iotDeviceCreateSchema,
  iotAlertHandleSchema,
} from "../backend/validators"

export const iotPingSchema = z.object({
  n: z.number().optional(),
})

export const IOT_ACTION_SCHEMAS = {
  "iot.ping": iotPingSchema,
  "iot.listDevices": iotPageQuerySchema,
  "iot.createDevice": iotDeviceCreateSchema,
  "iot.listAlerts": iotPageQuerySchema,
  "iot.handleAlert": iotAlertHandleSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(IOT_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

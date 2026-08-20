import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  bpmPageQuerySchema,
  bpmTaskActionSchema,
} from "../backend/validators"

export const bpmPingSchema = z.object({
  n: z.number().optional(),
})

export const BPM_ACTION_SCHEMAS = {
  "bpm.ping": bpmPingSchema,
  "bpm.listDefinitions": bpmPageQuerySchema,
  "bpm.listTasks": bpmPageQuerySchema,
  "bpm.actionTask": bpmTaskActionSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(BPM_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  reportPageQuerySchema,
  reportExportSchema,
} from "../backend/validators"

export const reportPingSchema = z.object({
  n: z.number().optional(),
})

export const REPORT_ACTION_SCHEMAS = {
  "report.ping": reportPingSchema,
  "report.listBoards": reportPageQuerySchema,
  "report.exportBoard": reportExportSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(REPORT_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

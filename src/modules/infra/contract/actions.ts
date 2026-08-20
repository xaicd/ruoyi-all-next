import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  updateConfigSchema,
  infraCodegenPreviewSchema,
  templatePreviewSchema,
  infraCodegenExportSchema,
} from "../backend/validators"

export const infraPingSchema = z.object({
  n: z.number().optional(),
})

export const INFRA_ACTION_SCHEMAS = {
  "infra.ping": infraPingSchema,
  "infra.updateConfig": updateConfigSchema,
  "infra.previewCodegen": infraCodegenPreviewSchema,
  "infra.generateCodegen": infraCodegenPreviewSchema,
  "infra.previewTemplate": templatePreviewSchema,
  "infra.generateTemplate": infraCodegenExportSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(INFRA_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

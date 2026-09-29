import { z } from "zod"
import { registerActionSchema } from "@/modules/shared/backend/lib/broker-validator"
import {
  onlinePageDefinitionsSchema,
  resolvePublishedReleaseSchema,
  pageManagedRecordsSchema,
  getManagedRecordSchema,
  createManagedRecordSchema,
  updateManagedRecordSchema,
  deleteManagedRecordSchema,
} from "../backend/validators"

export const onlinePingSchema = z.object({
  n: z.number().optional(),
})

export const ONLINE_ACTION_SCHEMAS = {
  "online.ping": onlinePingSchema,
  "online.pageDefinitions": onlinePageDefinitionsSchema,
  "online.resolvePublishedRelease": resolvePublishedReleaseSchema,
  "online.resolveCodegenImport": resolvePublishedReleaseSchema,
  "online.pageManagedRecords": pageManagedRecordsSchema,
  "online.getManagedRecord": getManagedRecordSchema,
  "online.createManagedRecord": createManagedRecordSchema,
  "online.updateManagedRecord": updateManagedRecordSchema,
  "online.deleteManagedRecord": deleteManagedRecordSchema,
} as const

export function registerActionSchemas() {
  for (const [action, schema] of Object.entries(ONLINE_ACTION_SCHEMAS)) {
    registerActionSchema(action, schema)
  }
}

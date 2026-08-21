import { z } from "zod"

export const infraPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const apiErrorLogQuerySchema = infraPageQuerySchema.extend({
  status: z.enum(["UNPROCESSED", "PROCESSED"]).optional(),
})

export const apiErrorLogProcessSchema = z.object({
  processNote: z.string().trim().max(500).optional(),
})

export const infraConfigUpdateSchema = z.object({
  id: z.string().trim().min(1),
  value: z.string().trim().min(1),
})

export const updateConfigSchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim().min(0).max(500),
  remark: z.string().trim().max(500).optional(),
})

export const infraJobOperateSchema = z.object({
  id: z.string().trim().min(1),
  action: z.enum(["TRIGGER", "PAUSE", "RESUME"]),
})

export const triggerJobSchema = infraJobOperateSchema

export const infraCodegenExportSchema = z.object({
  tableId: z.string().trim().min(1).optional(),
  templateType: z.string().optional(),
  stack: z.string().optional(),
  templateCodes: z.array(z.string()).optional(),
  variables: z.record(z.string(), z.any()).optional(),
  includeDisabled: z.boolean().optional(),
})

export const infraCodegenPreviewSchema = z.object({
  moduleName: z.string().trim().min(1),
  className: z.string().trim().min(1),
}).passthrough()

export const templatePreviewSchema = z.object({
  templateCode: z.string().trim().min(1),
  variables: z.record(z.string(), z.any()).optional().default({}),
})

export type InfraPageQueryInput = z.infer<typeof infraPageQuerySchema>
export type InfraConfigUpdateInput = z.infer<typeof infraConfigUpdateSchema>
export type UpdateConfigInput = z.infer<typeof updateConfigSchema>
export type InfraJobOperateInput = z.infer<typeof infraJobOperateSchema>
export type TriggerJobInput = z.infer<typeof triggerJobSchema>
export type InfraCodegenExportInput = z.infer<typeof infraCodegenExportSchema>
export type InfraCodegenPreviewInput = z.infer<typeof infraCodegenPreviewSchema>
export type TemplatePreviewRpcInput = z.infer<typeof templatePreviewSchema>

export {
  createDataSourceConfigSchema,
  dataSourceConfigPageSchema,
  getQueryConnectionSchema,
  listQueryDataSourcesSchema,
  testDataSourceConnectionSchema,
  updateDataSourceConfigSchema,
} from "./data-source-config.validator"

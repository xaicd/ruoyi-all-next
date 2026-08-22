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

export const getConfigByKeySchema = z.object({
  key: z.string().trim().min(1, "配置 key 不能为空"),
})

export const infraConfigListSchema = infraPageQuerySchema.extend({
  category: z.string().trim().max(50).optional(),
  key: z.string().trim().min(1).optional(),
})

export const infraConfigCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  configKey: z.string().trim().min(1).max(100),
  value: z.string().trim().min(0).max(500),
  category: z.string().trim().max(50).optional(),
  visible: z.boolean().default(true),
  remark: z.string().trim().max(500).optional(),
})

export const infraJobListSchema = infraPageQuerySchema.extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const infraJobCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  handlerName: z.string().trim().min(1).max(200),
  handlerParam: z.string().trim().max(500).optional(),
  cronExpression: z.string().trim().min(1).max(50),
  retryCount: z.coerce.number().int().min(0).default(0),
  retryInterval: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const infraFileListSchema = infraPageQuerySchema.extend({
  type: z.string().trim().max(100).optional(),
})

export const infraFileRecordSchema = z.object({
  configId: z.string().trim().min(1),
  name: z.string().trim().optional(),
  path: z.string().trim().min(1),
  url: z.string().trim().min(1),
  type: z.string().trim().optional(),
  size: z.coerce.number().int().min(0),
  contentBase64: z.string().trim().max(8_000_000).optional(),
})

export const infraResourceIdSchema = z.object({
  id: z.string().trim().min(1, "id 不能为空"),
})

export const infraResourceStatusSchema = infraResourceIdSchema.extend({
  status: z.enum(["ACTIVE", "DISABLED"]),
})

export const infraConfigItemUpdateSchema = infraResourceIdSchema.extend({
  name: z.string().trim().min(1).max(100).optional(),
  value: z.string().trim().max(500).optional(),
  category: z.string().trim().max(50).optional(),
  visible: z.boolean().optional(),
  remark: z.string().trim().max(500).optional(),
})

export const infraJobUpdateSchema = infraResourceIdSchema.extend({
  name: z.string().trim().min(1).max(100).optional(),
  handlerName: z.string().trim().max(200).optional(),
  handlerParam: z.string().trim().max(500).optional(),
  cronExpression: z.string().trim().max(50).optional(),
  retryCount: z.coerce.number().int().min(0).optional(),
  retryInterval: z.coerce.number().int().min(0).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const infraPageListSchema = z.object({
  status: z.string().trim().max(32).optional(),
})

export const getPageBySlugSchema = z.object({
  slug: z.string().trim().min(1).max(200),
})

export const processApiErrorLogSchema = infraResourceIdSchema.extend({
  processedBy: z.string().trim().min(1),
  processNote: z.string().trim().max(500).optional(),
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
export type GetConfigByKeyInput = z.infer<typeof getConfigByKeySchema>
export type InfraConfigListInput = z.infer<typeof infraConfigListSchema>
export type InfraConfigCreateInput = z.infer<typeof infraConfigCreateSchema>
export type InfraJobListInput = z.infer<typeof infraJobListSchema>
export type InfraJobCreateInput = z.infer<typeof infraJobCreateSchema>
export type InfraFileListInput = z.infer<typeof infraFileListSchema>
export type InfraFileRecordInput = z.infer<typeof infraFileRecordSchema>
export type InfraResourceIdInput = z.infer<typeof infraResourceIdSchema>
export type InfraConfigItemUpdateInput = z.infer<typeof infraConfigItemUpdateSchema>
export type InfraJobUpdateInput = z.infer<typeof infraJobUpdateSchema>
export type InfraPageListInput = z.infer<typeof infraPageListSchema>
export type GetPageBySlugInput = z.infer<typeof getPageBySlugSchema>
export type ProcessApiErrorLogInput = z.infer<typeof processApiErrorLogSchema>
export type InfraJobOperateInput = z.infer<typeof infraJobOperateSchema>
export type TriggerJobInput = z.infer<typeof triggerJobSchema>
export type InfraCodegenExportInput = z.infer<typeof infraCodegenExportSchema>
export type InfraCodegenPreviewInput = z.infer<typeof infraCodegenPreviewSchema>
export type TemplatePreviewRpcInput = z.infer<typeof templatePreviewSchema>

export const codegenTableListSchema = infraPageQuerySchema.extend({
  tenantId: z.string().trim().min(1).optional(),
})

export const codegenTableIdSchema = z.object({
  id: z.string().trim().min(1, "id 不能为空"),
  tenantId: z.string().trim().min(1).optional(),
})

export const codegenTableIdsSchema = z.object({
  ids: z.union([z.array(z.string().trim().min(1)), z.string().trim().min(1)]).transform((value) => (Array.isArray(value) ? value : value.split(",").map((id) => id.trim()).filter(Boolean))),
  tenantId: z.string().trim().min(1).optional(),
})

export const codegenTableUpdateSchema = codegenTableIdSchema.extend({
  tableComment: z.string().trim().min(1).max(100).optional(),
  moduleName: z.string().trim().min(1).optional(),
  businessName: z.string().trim().min(1).max(100).optional(),
  className: z.string().trim().min(1).optional(),
  template: z.literal("CRUD").optional(),
  scene: z.enum(["ADMIN", "APP"]).optional(),
  permissionPrefix: z.string().trim().nullable().optional(),
  columns: z.array(z.object({ name: z.string().trim().min(1) }).passthrough()).optional(),
})

export const codegenCandidateQuerySchema = infraPageQuerySchema.extend({
  source: z.enum(["ALL", "ONLINE", "DATABASE"]).default("ALL"),
  tenantId: z.string().trim().min(1, "tenantId 不能为空"),
})

export const codegenImportSchema = z.object({
  tenantId: z.string().trim().min(1, "tenantId 不能为空"),
  candidates: z.array(z.discriminatedUnion("source", [
    z.object({ source: z.literal("DATABASE"), tableName: z.string().trim().min(1).max(100) }).strict(),
    z.object({ source: z.literal("ONLINE"), definitionCode: z.string().trim().regex(/^[a-z][a-z0-9_]{1,63}$/), releaseId: z.string().uuid() }).strict(),
  ])).min(1, "至少选择一张表").max(100),
})

export const auditLogRetentionSchema = z.object({
  dryRun: z.boolean().default(true),
})

export type CodegenTableListInput = z.infer<typeof codegenTableListSchema>
export type CodegenTableIdInput = z.infer<typeof codegenTableIdSchema>
export type CodegenTableIdsInput = z.infer<typeof codegenTableIdsSchema>
export type CodegenTableUpdateInput = z.infer<typeof codegenTableUpdateSchema>
export type CodegenCandidateQueryInput = z.infer<typeof codegenCandidateQuerySchema>
export type CodegenImportInput = z.infer<typeof codegenImportSchema>
export type AuditLogRetentionInput = z.infer<typeof auditLogRetentionSchema>

export const emptyPayloadSchema = z.object({})

export {
  createDataSourceConfigSchema,
  dataSourceConfigPageSchema,
  getQueryConnectionSchema,
  listQueryDataSourcesSchema,
  testDataSourceConnectionSchema,
  updateDataSourceConfigSchema,
} from "./data-source-config.validator"

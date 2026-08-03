import { z } from "zod"

export const infraPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const updateConfigSchema = z.object({
  key: z.string().trim().min(1, "配置 Key 不能为空"),
  value: z.string().trim().min(1, "配置值不能为空"),
  remark: z.string().trim().max(200).optional(),
})

export const triggerJobSchema = z.object({
  jobId: z.string().trim().min(1, "任务 ID 不能为空"),
  action: z.enum(["run", "pause", "resume"]),
})

export const infraCodegenTemplateSchema = z.object({
  id: z.string().trim().min(1).optional(),
  code: z.string().trim().min(1, "模板编码不能为空").max(100),
  name: z.string().trim().min(1, "模板名称不能为空").max(100),
  category: z.enum(["CRUD", "TREE", "SINGLETON", "WORKFLOW", "DOMAIN", "FOUNDATION"]),
  templateType: z.enum(["BACKEND", "FRONTEND", "API", "SQL"]),
  engine: z.enum(["handlebars", "mustache", "ejs", "json-template"]),
  content: z.string().min(1, "模板内容不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]),
  description: z.string().trim().max(500).optional(),
  options: z.record(z.string(), z.unknown()).optional(),
})

export const infraCodegenPreviewSchema = z.object({
  templateCode: z.string().trim().min(1, "模板编码不能为空"),
  variables: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
})

export const infraCodegenExportSchema = z.object({
  stack: z.string().trim().min(1).default("next-react"),
  templateCodes: z.array(z.string().trim().min(1)).optional(),
  includeDisabled: z.boolean().default(false),
  format: z.enum(["json", "zip"]).default("json"),
  variables: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
})

export type InfraPageQueryInput = z.infer<typeof infraPageQuerySchema>
export type UpdateConfigInput = z.infer<typeof updateConfigSchema>
export type TriggerJobInput = z.infer<typeof triggerJobSchema>
export type InfraCodegenTemplateInput = z.infer<typeof infraCodegenTemplateSchema>
export type InfraCodegenPreviewInput = z.infer<typeof infraCodegenPreviewSchema>
export type InfraCodegenExportInput = z.infer<typeof infraCodegenExportSchema>

import { z } from "zod"
import { ONLINE_MODEL_TYPES } from "../application/online-definition.contract"
import { onlineInteractionIrSchema } from "../application/online-interaction.compiler"
import { onlineModelIrSchema } from "../application/online-schema-plan.compiler"

const metadataObject = z.record(z.string(), z.unknown()).default({})
const codeSchema = z.string().trim().regex(/^[a-z][a-z0-9_]{1,63}$/, "code 必须以小写字母开头，仅允许小写字母、数字和下划线")

export const onlineDefinitionPageSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().min(1).max(100).optional(),
  modelType: z.enum(ONLINE_MODEL_TYPES).optional(),
  status: z.enum(["DRAFT", "ACTIVE"]).optional(),
})

export const createOnlineDefinitionSchema = z.object({
  code: codeSchema,
  name: z.string().trim().min(1).max(100),
  modelType: z.enum(ONLINE_MODEL_TYPES),
  model: onlineModelIrSchema.optional(),
  interaction: onlineInteractionIrSchema.optional(),
})

export const updateOnlineDefinitionSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  expectedLockVersion: z.number().int().min(1),
})

export const archiveOnlineDefinitionSchema = z.object({
  expectedLockVersion: z.number().int().min(1),
})

export const deleteOnlineDefinitionSchema = z.object({
  expectedLockVersion: z.number().int().min(1),
})

export const updateOnlineRevisionSchema = z.object({
  expectedLockVersion: z.number().int().min(1),
  model: onlineModelIrSchema.optional(),
  interaction: onlineInteractionIrSchema.optional(),
  views: z.array(z.unknown()).max(4).optional(),
  policy: metadataObject.optional(),
  workflow: metadataObject.optional(),
})

export const normalizeOnlineSystemFieldsSchema = z.object({
  expectedLockVersion: z.number().int().min(1),
})

export const createOnlineSchemaPlanSchema = z.object({
  expectedLockVersion: z.number().int().min(1),
})

export const approveOnlineSchemaPlanSchema = z.object({
  expectedLockVersion: z.number().int().min(1),
  note: z.string().trim().min(1).max(500).optional(),
})

export const validateOnlineRevisionSchema = z.object({
  expectedLockVersion: z.number().int().min(1),
})

export const publishOnlineRevisionSchema = z.object({
  expectedLockVersion: z.number().int().min(1),
})

const runtimeRecordDataSchema = z.record(z.string(), z.unknown()).refine((value) => Object.keys(value).length <= 128, "记录字段不能超过 128 个")
const runtimeQueryValueSchema = z.union([z.string().max(500), z.number().finite(), z.boolean(), z.null()])
const runtimeQueryConditionsSchema = z.preprocess((value) => {
  if (typeof value !== "string") return value
  try { return JSON.parse(value) } catch { return value }
}, z.array(z.object({ field: codeSchema, value: z.union([runtimeQueryValueSchema, z.array(runtimeQueryValueSchema).min(1).max(32)]) })).max(32)).default([])
export const createOnlineTestSessionSchema = z.object({})
export const onlineRuntimeRecordPageSchema = z.object({ page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(20), conditions: runtimeQueryConditionsSchema })
export const createOnlineRuntimeRecordSchema = z.object({ data: runtimeRecordDataSchema })
export const updateOnlineRuntimeRecordSchema = z.object({ data: runtimeRecordDataSchema })

export const rollbackOnlineDefinitionSchema = z.object({
  releaseId: z.string().trim().min(1),
  expectedLockVersion: z.number().int().min(1),
})

export type OnlineDefinitionPageInput = z.infer<typeof onlineDefinitionPageSchema>
export type ArchiveOnlineDefinitionInput = z.infer<typeof archiveOnlineDefinitionSchema>
export type DeleteOnlineDefinitionInput = z.infer<typeof deleteOnlineDefinitionSchema>
export type CreateOnlineSchemaPlanInput = z.infer<typeof createOnlineSchemaPlanSchema>
export type NormalizeOnlineSystemFieldsInput = z.infer<typeof normalizeOnlineSystemFieldsSchema>
export type ApproveOnlineSchemaPlanInput = z.infer<typeof approveOnlineSchemaPlanSchema>
export type CreateOnlineDefinitionInput = z.infer<typeof createOnlineDefinitionSchema>
export type UpdateOnlineDefinitionInput = z.infer<typeof updateOnlineDefinitionSchema>
export type UpdateOnlineRevisionInput = z.infer<typeof updateOnlineRevisionSchema>
export type ValidateOnlineRevisionInput = z.infer<typeof validateOnlineRevisionSchema>
export type PublishOnlineRevisionInput = z.infer<typeof publishOnlineRevisionSchema>
export type RollbackOnlineDefinitionInput = z.infer<typeof rollbackOnlineDefinitionSchema>
export type CreateOnlineTestSessionInput = z.infer<typeof createOnlineTestSessionSchema>
export type OnlineRuntimeRecordPageInput = z.infer<typeof onlineRuntimeRecordPageSchema>
export type CreateOnlineRuntimeRecordInput = z.infer<typeof createOnlineRuntimeRecordSchema>
export type UpdateOnlineRuntimeRecordInput = z.infer<typeof updateOnlineRuntimeRecordSchema>

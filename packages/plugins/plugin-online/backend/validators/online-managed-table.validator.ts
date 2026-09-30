import { z } from "zod"

const managedTableScopeSchema = z.object({
  tenantId: z.string().trim().min(1, "tenantId 不能为空"),
  actorId: z.string().trim().min(1, "actorId 不能为空"),
  definitionCode: z.string().trim().min(1, "definitionCode 不能为空"),
  releaseId: z.string().trim().min(1, "releaseId 不能为空"),
  schemaRevision: z.coerce.number().int().min(0),
})

const runtimeQueryValueSchema = z.union([z.string().max(500), z.number().finite(), z.boolean(), z.null()])

export const pageManagedRecordsSchema = managedTableScopeSchema.extend({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  conditions: z.array(z.object({
    field: z.string().trim().min(1),
    value: z.union([runtimeQueryValueSchema, z.array(runtimeQueryValueSchema).min(1).max(32)]),
  })).max(32).optional().default([]),
})

export const getManagedRecordSchema = managedTableScopeSchema.extend({
  id: z.string().trim().min(1, "id 不能为空"),
})

export const createManagedRecordSchema = managedTableScopeSchema.extend({
  data: z.record(z.string(), z.unknown()),
})

export const updateManagedRecordSchema = managedTableScopeSchema.extend({
  id: z.string().trim().min(1, "id 不能为空"),
  data: z.record(z.string(), z.unknown()),
})

export const deleteManagedRecordSchema = getManagedRecordSchema

export type PageManagedRecordsInput = z.infer<typeof pageManagedRecordsSchema>
export type GetManagedRecordInput = z.infer<typeof getManagedRecordSchema>
export type CreateManagedRecordInput = z.infer<typeof createManagedRecordSchema>
export type UpdateManagedRecordInput = z.infer<typeof updateManagedRecordSchema>
export type DeleteManagedRecordInput = z.infer<typeof deleteManagedRecordSchema>

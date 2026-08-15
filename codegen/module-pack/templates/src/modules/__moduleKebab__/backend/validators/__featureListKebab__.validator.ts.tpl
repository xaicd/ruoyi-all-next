import { z } from "zod"

export const {{featureCamel}}PageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
}).strict()

export const {{featureCamel}}CreateSchema = z.object({
  name: z.string().trim().min(1, "名称不能为空").max(100),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
}).strict()

export const {{featureCamel}}UpdateSchema = {{featureCamel}}CreateSchema.partial().extend({
  id: z.string().min(1, "id 不能为空"),
}).strict()

export type {{featureListPascal}}PageQueryInput = z.infer<typeof {{featureCamel}}PageQuerySchema>
export type {{featureListPascal}}CreateInput = z.infer<typeof {{featureCamel}}CreateSchema>
export type {{featureListPascal}}UpdateInput = z.infer<typeof {{featureCamel}}UpdateSchema>

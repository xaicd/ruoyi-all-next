import { z } from "zod"

export const {{moduleCamel}}PageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export type {{modulePascal}}PageQueryInput = z.infer<typeof {{moduleCamel}}PageQuerySchema>

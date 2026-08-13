import { z } from "zod"

// === 通用分页查询 ===
export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(50).optional(),
})

export const systemModulePageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export type PageQueryInput = z.infer<typeof pageQuerySchema>
export type SystemModulePageQueryInput = z.infer<typeof systemModulePageQuerySchema>

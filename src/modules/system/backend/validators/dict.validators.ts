import { z } from "zod"

// === 字典 ===
export const createDictItemSchema = z.object({
  dictType: z.string().trim().min(1, "dictType 不能为空"),
  label: z.string().trim().min(1, "label 不能为空"),
  value: z.string().trim().min(1, "value 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const getDictDataByTypeSchema = z.object({
  type: z.string().trim().min(1, "type 不能为空"),
})

export const dictTypeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(50).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  type: z.string().trim().min(1).optional(),
})

export const createDictTypeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  type: z.string().trim().min(1).max(100),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  remark: z.string().trim().max(500).optional(),
})

export type CreateDictItemInput = z.infer<typeof createDictItemSchema>
export type GetDictDataByTypeInput = z.infer<typeof getDictDataByTypeSchema>
export type DictTypeListQueryInput = z.infer<typeof dictTypeListQuerySchema>
export type CreateDictTypeInput = z.infer<typeof createDictTypeSchema>

import { z } from "zod"

export const wmsPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const wmsCheckinSchema = z.object({
  warehouseId: z.string().trim().min(1, "warehouseId 不能为空"),
  quantity: z.coerce.number().int().min(1).max(100000),
  note: z.string().trim().max(120).optional(),
})

export type WmsPageQueryInput = z.infer<typeof wmsPageQuerySchema>
export type WmsCheckinInput = z.infer<typeof wmsCheckinSchema>

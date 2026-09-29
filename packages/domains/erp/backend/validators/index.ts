import { z } from "zod"

export const erpPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const erpStockAdjustmentSchema = z.object({
  productId: z.string().trim().min(1, "productId 不能为空"),
  delta: z.coerce.number().int().min(-10000).max(10000),
  reason: z.string().trim().min(1, "调整原因不能为空").max(120, "调整原因不能超过 120 字"),
})

export type ErpPageQueryInput = z.infer<typeof erpPageQuerySchema>
export type ErpStockAdjustmentInput = z.infer<typeof erpStockAdjustmentSchema>

import { z } from "zod"

export const mallPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const mallCouponIssueSchema = z.object({
  couponTemplateId: z.string().trim().min(1, "couponTemplateId 不能为空"),
  targetUserId: z.string().trim().min(1, "targetUserId 不能为空"),
  amount: z.coerce.number().int().min(1).max(20),
})

export type MallPageQueryInput = z.infer<typeof mallPageQuerySchema>
export type MallCouponIssueInput = z.infer<typeof mallCouponIssueSchema>

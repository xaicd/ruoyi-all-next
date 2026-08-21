import { z } from "zod"

export const crmPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
  level: z.enum(["A", "B", "C", "D"]).optional(),
  status: z.enum(["ACTIVE", "LOCKED", "POOL"]).optional(),
})

export const crmFollowupSchema = z.object({
  customerId: z.string().trim().min(1, "customerId 不能为空"),
  content: z.string().trim().min(1, "跟进内容不能为空").max(300, "跟进内容不能超过 300 字"),
})

export type CrmPageQueryInput = z.infer<typeof crmPageQuerySchema>
export type CrmFollowupInput = z.infer<typeof crmFollowupSchema>

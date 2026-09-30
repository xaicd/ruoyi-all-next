import { z } from "zod"

export const imPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const imMessageAuditSchema = z.object({
  conversationId: z.string().trim().min(1, "conversationId 不能为空"),
  messageId: z.string().trim().min(1, "messageId 不能为空"),
  decision: z.enum(["PASS", "REJECT"]),
  reason: z.string().trim().max(200).optional(),
})

export type ImPageQueryInput = z.infer<typeof imPageQuerySchema>
export type ImMessageAuditInput = z.infer<typeof imMessageAuditSchema>

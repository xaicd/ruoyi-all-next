import { z } from "zod"

export const mpPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const mpSendMessageSchema = z.object({
  accountId: z.string().trim().min(1, "accountId 不能为空"),
  content: z.string().trim().min(1, "消息内容不能为空").max(500, "消息内容不能超过 500 字"),
})

export type MpPageQueryInput = z.infer<typeof mpPageQuerySchema>
export type MpSendMessageInput = z.infer<typeof mpSendMessageSchema>

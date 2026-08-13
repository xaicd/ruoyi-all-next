import { z } from "zod"

// === 通知 ===
export const createNoticeSchema = z.object({
  title: z.string().trim().min(1, "title 不能为空"),
  content: z.string().trim().min(1, "content 不能为空"),
  type: z.enum(["INFO", "WARN", "ALERT"]).default("INFO"),
})

export const createNotifyTemplateSchema = z.object({
  code: z.string().trim().min(1, "code 不能为空"),
  name: z.string().trim().min(1, "name 不能为空"),
  channel: z.enum(["SITE", "SMS", "MAIL"]).default("SITE"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const createNotifyMessageSchema = z.object({
  templateCode: z.string().trim().min(1, "templateCode 不能为空"),
  receiver: z.string().trim().min(1, "receiver 不能为空"),
  status: z.enum(["SUCCESS", "FAIL"]).default("SUCCESS"),
})

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>
export type CreateNotifyTemplateInput = z.infer<typeof createNotifyTemplateSchema>
export type CreateNotifyMessageInput = z.infer<typeof createNotifyMessageSchema>

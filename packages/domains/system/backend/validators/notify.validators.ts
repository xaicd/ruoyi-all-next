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

export const updateNoticeSchema = z.object({
  id: z.string().trim().min(1, "id 不能为空"),
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().trim().min(1).optional(),
  type: z.enum(["INFO", "WARN", "ALERT"]).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const createAreaSchema = z.object({
  name: z.string().trim().min(1).max(50),
  parentId: z.string().trim().optional(),
  level: z.coerce.number().int().min(1).optional(),
})

export const updateAreaSchema = z.object({
  id: z.string().trim().min(1, "id 不能为空"),
  name: z.string().trim().min(1).max(50).optional(),
  parentId: z.string().trim().nullable().optional(),
  level: z.coerce.number().int().min(1).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>
export type CreateAreaInput = z.infer<typeof createAreaSchema>
export type UpdateAreaInput = z.infer<typeof updateAreaSchema>

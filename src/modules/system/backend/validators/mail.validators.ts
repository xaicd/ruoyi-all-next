import { z } from "zod"

// === 邮件 ===
export const createMailAccountSchema = z.object({
  email: z.string().trim().email("邮箱格式不正确"),
  host: z.string().trim().min(1, "host 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type CreateMailAccountInput = z.infer<typeof createMailAccountSchema>

export const createMailTemplateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  code: z.string().trim().min(1).max(100),
  subject: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const updateMailTemplateSchema = z.object({
  id: z.string().trim().min(1, "id 不能为空"),
  name: z.string().trim().min(1).max(100).optional(),
  code: z.string().trim().min(1).max(100).optional(),
  subject: z.string().trim().min(1).max(200).optional(),
  content: z.string().trim().min(1).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export type CreateMailTemplateInput = z.infer<typeof createMailTemplateSchema>
export type UpdateMailTemplateInput = z.infer<typeof updateMailTemplateSchema>

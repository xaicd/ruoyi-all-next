import { z } from "zod"

// === 短信 ===
export const createSmsChannelSchema = z.object({
  name: z.string().trim().min(1, "name 不能为空"),
  signName: z.string().trim().min(1, "signName 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type CreateSmsChannelInput = z.infer<typeof createSmsChannelSchema>

export const createSmsTemplateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  code: z.string().trim().min(1).max(100),
  content: z.string().trim().min(1),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const updateSmsTemplateSchema = z.object({
  id: z.string().trim().min(1, "id 不能为空"),
  name: z.string().trim().min(1).max(100).optional(),
  code: z.string().trim().min(1).max(100).optional(),
  content: z.string().trim().min(1).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export type CreateSmsTemplateInput = z.infer<typeof createSmsTemplateSchema>
export type UpdateSmsTemplateInput = z.infer<typeof updateSmsTemplateSchema>

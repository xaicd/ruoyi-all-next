import { z } from "zod"

export const systemModulePageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const createSmsChannelSchema = z.object({
  name: z.string().trim().min(1, "name 不能为空"),
  signName: z.string().trim().min(1, "signName 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const createMailAccountSchema = z.object({
  email: z.string().trim().email("邮箱格式不正确"),
  host: z.string().trim().min(1, "host 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const createSocialUserSchema = z.object({
  provider: z.enum(["WECHAT", "DOUYIN", "WEIBO"]),
  nickname: z.string().trim().min(1, "nickname 不能为空"),
  externalId: z.string().trim().min(1, "externalId 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type SystemModulePageQueryInput = z.infer<typeof systemModulePageQuerySchema>
export type CreateSmsChannelInput = z.infer<typeof createSmsChannelSchema>
export type CreateMailAccountInput = z.infer<typeof createMailAccountSchema>
export type CreateSocialUserInput = z.infer<typeof createSocialUserSchema>

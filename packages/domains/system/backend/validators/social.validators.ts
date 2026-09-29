import { z } from "zod"

// === 社交 ===
export const createSocialUserSchema = z.object({
  provider: z.enum(["WECHAT", "DOUYIN", "WEIBO"]),
  nickname: z.string().trim().min(1, "nickname 不能为空"),
  externalId: z.string().trim().min(1, "externalId 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type CreateSocialUserInput = z.infer<typeof createSocialUserSchema>

export const createSocialClientSchema = z.object({
  name: z.string().trim().min(1).max(100),
  provider: z.enum(["WECHAT", "DOUYIN", "WEIBO"]),
  clientId: z.string().trim().min(1).max(200),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const updateSocialClientSchema = z.object({
  id: z.string().trim().min(1, "id 不能为空"),
  name: z.string().trim().min(1).max(100).optional(),
  provider: z.enum(["WECHAT", "DOUYIN", "WEIBO"]).optional(),
  clientId: z.string().trim().min(1).max(200).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export type CreateSocialClientInput = z.infer<typeof createSocialClientSchema>
export type UpdateSocialClientInput = z.infer<typeof updateSocialClientSchema>

import { z } from "zod"

// === 社交 ===
export const createSocialUserSchema = z.object({
  provider: z.enum(["WECHAT", "DOUYIN", "WEIBO"]),
  nickname: z.string().trim().min(1, "nickname 不能为空"),
  externalId: z.string().trim().min(1, "externalId 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type CreateSocialUserInput = z.infer<typeof createSocialUserSchema>

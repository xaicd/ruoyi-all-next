import { z } from "zod"

// === 认证 ===
export const loginSchema = z.object({
  username: z.string().trim().min(1, "用户名不能为空"),
  password: z.string().trim().min(1, "密码不能为空"),
  /** Required for tenant accounts; a normalized globally-unique tenantCode. */
  tenantCode: z.string().trim().toLowerCase().min(2, "租户编码不能为空").max(32).regex(/^[a-z][a-z0-9-]*[a-z0-9]$/, "租户编码格式不正确").optional(),
})

export const captchaVerifySchema = z.object({
  captchaId: z.string().trim().min(1, "captchaId 不能为空"),
  code: z.string().trim().min(1, "验证码不能为空"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type CaptchaVerifyInput = z.infer<typeof captchaVerifySchema>

export const emptyPayloadSchema = z.object({})

export const actorIdSchema = z.object({
  userId: z.string().trim().min(1, "userId 不能为空"),
})

export const refreshTokenSchema = z.object({
  token: z.string().trim().min(1, "token 不能为空"),
})

export const sidebarNavSchema = z.object({
  userId: z.string().trim().min(1, "userId 不能为空"),
  isPlatformAdmin: z.coerce.boolean().default(false),
})

export type ActorIdInput = z.infer<typeof actorIdSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type SidebarNavInput = z.infer<typeof sidebarNavSchema>

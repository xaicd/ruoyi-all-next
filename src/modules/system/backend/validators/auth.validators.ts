import { z } from "zod"

// === 认证 ===
export const loginSchema = z.object({
  username: z.string().trim().min(1, "用户名不能为空"),
  password: z.string().trim().min(1, "密码不能为空"),
})

export const captchaVerifySchema = z.object({
  captchaId: z.string().trim().min(1, "captchaId 不能为空"),
  code: z.string().trim().min(1, "验证码不能为空"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type CaptchaVerifyInput = z.infer<typeof captchaVerifySchema>

import { z } from "zod"

// === 邮件 ===
export const createMailAccountSchema = z.object({
  email: z.string().trim().email("邮箱格式不正确"),
  host: z.string().trim().min(1, "host 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type CreateMailAccountInput = z.infer<typeof createMailAccountSchema>

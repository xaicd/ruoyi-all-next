import { z } from "zod"

// === 短信 ===
export const createSmsChannelSchema = z.object({
  name: z.string().trim().min(1, "name 不能为空"),
  signName: z.string().trim().min(1, "signName 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type CreateSmsChannelInput = z.infer<typeof createSmsChannelSchema>

import { z } from "zod"

// === 字典 ===
export const createDictItemSchema = z.object({
  dictType: z.string().trim().min(1, "dictType 不能为空"),
  label: z.string().trim().min(1, "label 不能为空"),
  value: z.string().trim().min(1, "value 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type CreateDictItemInput = z.infer<typeof createDictItemSchema>

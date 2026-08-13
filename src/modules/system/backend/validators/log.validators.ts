import { z } from "zod"
import { pageQuerySchema } from "./common.validators"

// === 日志查询 ===
export const loginLogQuerySchema = pageQuerySchema.extend({
  result: z.enum(["SUCCESS", "FAIL"]).optional(),
})

export const operateLogQuerySchema = pageQuerySchema.extend({
  module: z.string().trim().max(100).optional(),
})

// === 在线用户 ===
export const forceLogoutSchema = z.object({
  sessionId: z.string().min(1, "sessionId 不能为空"),
})

export type LoginLogQueryInput = z.infer<typeof loginLogQuerySchema>
export type OperateLogQueryInput = z.infer<typeof operateLogQuerySchema>
export type ForceLogoutInput = z.infer<typeof forceLogoutSchema>

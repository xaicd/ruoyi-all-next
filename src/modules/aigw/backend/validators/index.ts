import { z } from "zod"

export const aigwPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().optional(),
})

export const aigwChannelWriteSchema = z.object({
  name: z.string().min(1, "渠道名称不能为空"),
  provider: z.string().min(1, "提供商不能为空"),
  baseUrl: z.string().optional(),
  apiKey: z.string().optional(),
  models: z.array(z.string()).default([]),
  modelMap: z.record(z.string(), z.string()).optional(),
  weight: z.number().int().min(1).max(1000).optional(),
  priority: z.number().int().min(0).max(100).optional(),
  autoDisable: z.boolean().optional(),
})
export const aigwChannelCreateSchema = aigwChannelWriteSchema

export const aigwTokenWriteSchema = z.object({
  name: z.string().min(1, "令牌名称不能为空"),
  remainQuota: z.number().int().optional(),
  unlimited: z.boolean().optional(),
  models: z.array(z.string()).optional(),
  ipAllowlist: z.array(z.string()).optional(),
  group: z.string().optional(),
  expiresAt: z.string().optional(),
})
export const aigwTokenCreateSchema = aigwTokenWriteSchema

export const aigwModelWriteSchema = z.object({
  name: z.string().min(1, "模型名称不能为空"),
  modelKey: z.string().min(1, "模型标识不能为空"),
  provider: z.string().min(1, "提供商不能为空"),
  inputRatio: z.number().min(0).optional(),
  outputRatio: z.number().min(0).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  sort: z.number().int().optional(),
  description: z.string().optional(),
})
export const aigwModelCreateSchema = aigwModelWriteSchema

export const aigwRelayChatSchema = z.object({
  apiKey: z.string().min(1),
  model: z.string().min(1),
  messages: z.array(z.object({ role: z.string(), content: z.string() })),
  stream: z.boolean().optional(),
})

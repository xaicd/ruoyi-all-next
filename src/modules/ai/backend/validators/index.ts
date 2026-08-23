import { z } from "zod"

export const aiPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const aiModelCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  platform: z.enum(["OPENAI", "AZURE", "TONGYI", "WENXIN", "ZHIPU", "OLLAMA"]),
  model: z.string().trim().min(1).max(100),
  apiKey: z.string().trim().min(1),
  apiUrl: z.string().url().optional(),
  temperature: z.coerce.number().min(0).max(2).default(0.7),
  maxTokens: z.coerce.number().int().min(1).max(32768).default(4096),
})

export const aiChatDeleteSchema = z.object({
  chatId: z.string().trim().min(1, "chatId 不能为空"),
})

export const aiChannelWriteSchema = z.object({
  name: z.string().trim().min(1).max(100),
  provider: z.enum(["OPENAI", "AZURE", "ANTHROPIC", "GEMINI", "TONGYI", "DEEPSEEK", "MOMA", "CUSTOM", "MOCK"]),
  baseUrl: z.string().trim().max(500).optional(),
  apiKey: z.string().trim().max(500).optional(),
  models: z.array(z.string().trim().min(1)).min(1),
  modelMap: z.record(z.string(), z.string()).optional(),
  weight: z.coerce.number().int().min(1).max(1000).optional(),
  priority: z.coerce.number().int().min(0).max(100).optional(),
  autoDisable: z.boolean().optional(),
})

export const aiAccessTokenWriteSchema = z.object({
  name: z.string().trim().min(1).max(100),
  remainQuota: z.coerce.number().int().min(0).optional(),
  unlimited: z.boolean().optional(),
  models: z.array(z.string()).optional(),
  ipAllowlist: z.array(z.string()).optional(),
  group: z.string().trim().max(50).optional(),
  expiresAt: z.string().optional(),
})

export const aiRelayChatSchema = z.object({
  apiKey: z.string().trim().min(1).optional(),
  model: z.string().trim().min(1),
  messages: z.array(z.object({ role: z.string(), content: z.string() })).min(1),
  stream: z.boolean().optional(),
})

export type AiPageQueryInput = z.infer<typeof aiPageQuerySchema>
export type AiModelCreateInput = z.infer<typeof aiModelCreateSchema>
export type AiChatDeleteInput = z.infer<typeof aiChatDeleteSchema>
export type AiChannelWriteInput = z.infer<typeof aiChannelWriteSchema>
export type AiAccessTokenWriteInput = z.infer<typeof aiAccessTokenWriteSchema>
export type AiRelayChatInput = z.infer<typeof aiRelayChatSchema>

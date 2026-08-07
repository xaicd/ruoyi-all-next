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

export type AiPageQueryInput = z.infer<typeof aiPageQuerySchema>
export type AiModelCreateInput = z.infer<typeof aiModelCreateSchema>
export type AiChatDeleteInput = z.infer<typeof aiChatDeleteSchema>

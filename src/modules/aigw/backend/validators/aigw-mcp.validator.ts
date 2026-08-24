import { z } from "zod"

export const createMcpAssetSchema = z.object({
  mcpCode: z.string().min(2, "MCP代码不能少于2位").max(64),
  name: z.string().min(2, "MCP名称不能少于2位").max(100),
  category: z.enum(["GOV_DOC", "MEETING_OA", "BIDDING", "DEV_SECURITY", "HOTLINE", "TELECOM_CRM", "CUSTOM"]).default("CUSTOM"),
  icon: z.string().optional().default("⚡"),
  version: z.string().optional().default("v1.0.0"),
  description: z.string().optional().default(""),
  endpoint: z.string().url("端点必须为合法URL格式").or(z.string().min(5)),
})

export const updateMcpAssetSchema = z.object({
  id: z.string().min(1, "ID不能为空"),
  name: z.string().min(2).max(100).optional(),
  category: z.enum(["GOV_DOC", "MEETING_OA", "BIDDING", "DEV_SECURITY", "HOTLINE", "TELECOM_CRM", "CUSTOM"]).optional(),
  icon: z.string().optional(),
  version: z.string().optional(),
  description: z.string().optional(),
  endpoint: z.string().optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const mcpAssetPageQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  keyword: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
})

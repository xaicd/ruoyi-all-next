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

// === Entitlement 扩展通用属性 ===

export const createEnterpriseSchema = z.object({
  name: z.string().min(2, "企业名称至少2个字符").max(100),
  code: z.string().min(2, "企业编码至少2个字符").max(64),
  creditCode: z.string().optional(),
  province: z.string().default("广东"),
  city: z.string().default("广州"),
  industry: z.string().default("互联网/软件"),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
})
export const updateEnterpriseSchema = createEnterpriseSchema.partial().extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const createSeatSchema = z.object({
  enterpriseId: z.string().min(1, "企业ID不能为空"),
  userId: z.string().optional(),
  userName: z.string().min(1, "姓名不能为空"),
  userEmail: z.string().email("邮箱格式不正确").optional(),
  appType: z.enum(["WORKBUDDY", "QODER", "TRAE"]),
  vendorSeatId: z.string().optional(),
  monthlyTokenCap: z.number().int().positive().default(10000000),
})
export const updateSeatSchema = createSeatSchema.partial().extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const updateQuotaSchema = z.object({
  totalQuota: z.number().int().positive().optional(),
  usedQuota: z.number().int().nonnegative().optional(),
  warnThreshold: z.number().int().min(1).max(100).optional(),
  autoThrottle: z.boolean().optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const createPolicySchema = z.object({
  enterpriseId: z.string().min(1, "企业ID不能为空"),
  postCode: z.string().min(1, "岗位编码不能为空"),
  postName: z.string().min(1, "岗位名称不能为空"),
  mode: z.enum(["SEAT_EXCLUSIVE", "POOL_SHARED"]).default("POOL_SHARED"),
  monthlyTokenCap: z.number().int().positive().default(20000000),
  dailyTokenCap: z.number().int().positive().default(1000000),
  allowedApps: z.array(z.string()).default(["WORKBUDDY", "QODER", "TRAE"]),
})
export const updatePolicySchema = createPolicySchema.partial().extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const createChannelSchema = z.object({
  name: z.string().min(2, "渠道名称至少2个字符"),
  code: z.string().min(2, "渠道编码至少2个字符"),
  nodeType: z.enum(["PROVINCE", "CITY", "MANAGER", "PARTNER", "SECONDARY"]).default("MANAGER"),
  parentId: z.string().optional(),
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
  commissionRate: z.number().min(0).max(1).default(0.1),
})
export const updateChannelSchema = createChannelSchema.partial().extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

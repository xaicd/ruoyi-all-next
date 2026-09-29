import { z } from "zod"

export const payPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
  status: z.enum(["WAITING", "SUCCESS", "CLOSED", "REFUNDING", "REFUNDED", "REFUND"]).optional(),
  channelCode: z.string().trim().optional(),
})

export const payOrderCreateSchema = z.object({
  appId: z.string().trim().min(1, "appId 不能为空"),
  channelCode: z.enum(["ALIPAY_PC", "ALIPAY_WAP", "WEIXIN_NATIVE", "WEIXIN_JSAPI", "MOCK"]),
  merchantOrderId: z.string().trim().min(1, "商户单号不能为空"),
  subject: z.string().trim().min(1).max(100),
  amount: z.coerce.number().int().min(1, "金额必须大于0"),
  expireTime: z.string().datetime().optional(),
  notifyUrl: z.string().url().optional(),
})

export const payRefundCreateSchema = z.object({
  payOrderId: z.string().trim().min(1, "payOrderId 不能为空"),
  refundAmount: z.coerce.number().int().min(1, "退款金额必须大于0"),
  reason: z.string().trim().min(1).max(200),
})

export const payRefundPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
  status: z.enum(["WAITING", "SUCCESS", "FAIL", "PENDING", "FAILED"]).optional(),
})

export type PayPageQueryInput = z.infer<typeof payPageQuerySchema>
export type PayOrderCreateInput = z.infer<typeof payOrderCreateSchema>
export type PayRefundCreateInput = z.infer<typeof payRefundCreateSchema>
export type PayRefundPageQueryInput = z.infer<typeof payRefundPageQuerySchema>

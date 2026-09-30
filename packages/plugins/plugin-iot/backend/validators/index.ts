import { z } from "zod"

export const iotPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
  status: z.enum(["ONLINE", "OFFLINE", "FAULT"]).optional(),
})

export const iotDeviceCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  deviceKey: z.string().trim().min(1).max(100),
  productId: z.string().trim().min(1),
  gatewayId: z.string().optional(),
  remark: z.string().trim().max(200).optional(),
})

export const iotAlertHandleSchema = z.object({
  alertId: z.string().trim().min(1, "alertId 不能为空"),
  resolution: z.string().trim().min(1).max(500),
})

export type IotPageQueryInput = z.infer<typeof iotPageQuerySchema>
export type IotDeviceCreateInput = z.infer<typeof iotDeviceCreateSchema>
export type IotAlertHandleInput = z.infer<typeof iotAlertHandleSchema>

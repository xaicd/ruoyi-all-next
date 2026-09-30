import { z } from "zod"

export const mesPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const mesReportWorkSchema = z.object({
  workOrderId: z.string().trim().min(1, "workOrderId 不能为空"),
  outputQty: z.coerce.number().int().min(0).max(100000),
  scrapQty: z.coerce.number().int().min(0).max(100000),
  note: z.string().trim().max(120).optional(),
})

export type MesPageQueryInput = z.infer<typeof mesPageQuerySchema>
export type MesReportWorkInput = z.infer<typeof mesReportWorkSchema>

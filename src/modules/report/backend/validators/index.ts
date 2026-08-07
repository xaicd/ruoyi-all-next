import { z } from "zod"

export const reportPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const reportExportSchema = z.object({
  boardId: z.string().trim().min(1, "boardId 不能为空"),
  format: z.enum(["PDF", "EXCEL", "CSV"]).default("EXCEL"),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
})

export type ReportPageQueryInput = z.infer<typeof reportPageQuerySchema>
export type ReportExportInput = z.infer<typeof reportExportSchema>

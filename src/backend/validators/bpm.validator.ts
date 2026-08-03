import { z } from "zod"

export const bpmPageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

export const bpmTaskActionSchema = z.object({
  taskId: z.string().trim().min(1, "taskId 不能为空"),
  action: z.enum(["approve", "reject"]),
  comment: z.string().trim().max(200).optional(),
})

export type BpmPageQueryInput = z.infer<typeof bpmPageQuerySchema>
export type BpmTaskActionInput = z.infer<typeof bpmTaskActionSchema>

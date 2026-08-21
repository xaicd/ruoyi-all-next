import { z } from "zod"

export const deptQuerySchema = z.object({
  mode: z.enum(["tree", "list"]).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  keyword: z.string().trim().max(50).optional(),
})

export const createDeptSchema = z.object({
  name: z.string().trim().min(1, "部门名称不能为空").max(50),
  parentId: z.string().trim().optional(),
  sort: z.coerce.number().int().min(0).default(0),
  leaderId: z.string().trim().optional(),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export type DeptQueryInput = z.infer<typeof deptQuerySchema>
export type CreateDeptInput = z.infer<typeof createDeptSchema>

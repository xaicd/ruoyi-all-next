import { z } from "zod"
import { pageQuerySchema } from "./common.validators"

export const roleListQuerySchema = pageQuerySchema.extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
})

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, "角色名不能为空").max(30),
  code: z.string().trim().min(1, "角色编码不能为空").max(100),
  sort: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  dataScope: z.enum(["ALL", "DEPT", "DEPT_AND_CHILD", "SELF"]).default("ALL"),
  remark: z.string().trim().max(500).optional(),
})

export type RoleListQueryInput = z.infer<typeof roleListQuerySchema>
export type CreateRoleInput = z.infer<typeof createRoleSchema>

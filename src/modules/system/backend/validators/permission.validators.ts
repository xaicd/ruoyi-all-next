import { z } from "zod"

// === 权限分配 ===
export const assignUserRoleSchema = z.object({
  userId: z.string().trim().min(1, "userId 不能为空"),
  roleIds: z.array(z.string().trim().min(1)).max(50),
})

export const assignRoleMenuSchema = z.object({
  roleId: z.string().trim().min(1, "roleId 不能为空"),
  menuIds: z.array(z.string().trim().min(1)).max(200),
})

export type AssignUserRoleInput = z.infer<typeof assignUserRoleSchema>
export type AssignRoleMenuInput = z.infer<typeof assignRoleMenuSchema>

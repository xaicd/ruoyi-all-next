import { z } from "zod"
import { pageQuerySchema } from "./common.validators"

// === 用户管理 CRUD ===
export const createUserSchema = z.object({
  username: z.string().trim().min(2, "用户名至少 2 个字符").max(30),
  nickname: z.string().trim().min(1, "昵称不能为空").max(30),
  password: z.string().trim().min(6, "密码至少 6 位").max(32),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email("邮箱格式不正确").optional().or(z.literal("")),
  deptId: z.string().trim().optional(),
  postIds: z.array(z.string().trim().min(1, "岗位 ID 不能为空")).max(10).refine((ids) => new Set(ids).size === ids.length, "岗位不能重复选择").optional(),
  roleIds: z.array(z.string().trim()).max(20).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  remark: z.string().trim().max(200).optional(),
})

export const updateUserSchema = z.object({
  id: z.string().trim().min(1, "用户 ID 不能为空"),
  username: z.string().trim().min(2).max(30).optional(),
  nickname: z.string().trim().min(1).max(30).optional(),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  deptId: z.string().trim().optional(),
  postIds: z.array(z.string().trim().min(1, "岗位 ID 不能为空")).max(10).refine((ids) => new Set(ids).size === ids.length, "岗位不能重复选择").optional(),
  roleIds: z.array(z.string().trim()).max(20).optional(),
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  remark: z.string().trim().max(200).optional(),
})

export const updateUserPasswordSchema = z.object({
  id: z.string().trim().min(1, "用户 ID 不能为空"),
  password: z.string().trim().min(6, "密码至少 6 位").max(32),
})

export const deleteUserSchema = z.object({
  id: z.string().trim().min(1, "用户 ID 不能为空"),
})

export const userListQuerySchema = pageQuerySchema.extend({
  status: z.enum(["ACTIVE", "DISABLED"]).optional(),
  deptId: z.string().trim().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>
export type DeleteUserInput = z.infer<typeof deleteUserSchema>
export type UserListQueryInput = z.infer<typeof userListQuerySchema>

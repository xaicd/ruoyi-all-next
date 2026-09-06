import { z } from "zod"

/** C 端会员注册（账号密码，自包含，无外部依赖） */
export const memberRegisterSchema = z.object({
  account: z.string().trim().min(3, "账号至少 3 位").max(64, "账号过长"),
  email: z.string().trim().email("邮箱格式不正确").max(120).optional(),
  password: z.string().min(6, "密码至少 6 位").max(64, "密码过长"),
  nickname: z.string().trim().min(1, "昵称不能为空").max(60).optional(),
})

/** C 端会员登录 */
export const memberLoginSchema = z.object({
  account: z.string().trim().min(1, "请输入账号"),
  password: z.string().min(1, "请输入密码"),
})

/** 更新个人资料（不含账号/密码） */
export const memberProfileUpdateSchema = z.object({
  nickname: z.string().trim().min(1).max(60).optional(),
  avatarUrl: z.string().trim().url("头像地址无效").max(500).optional(),
  /** 动态字段值（客户在后台加的字段），键为字段 code */
  extraFields: z.record(z.string(), z.unknown()).optional(),
})

export type MemberRegisterInput = z.infer<typeof memberRegisterSchema>
export type MemberLoginInput = z.infer<typeof memberLoginSchema>
export type MemberProfileUpdateInput = z.infer<typeof memberProfileUpdateSchema>

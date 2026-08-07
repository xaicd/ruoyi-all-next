import { z } from "zod"

// === 通用分页查询 ===
export const pageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(50).optional(),
})

export const systemModulePageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  keyword: z.string().trim().max(100).optional(),
})

// === 认证 ===
export const loginSchema = z.object({
  username: z.string().trim().min(1, "用户名不能为空"),
  password: z.string().trim().min(1, "密码不能为空"),
})

export const captchaVerifySchema = z.object({
  captchaId: z.string().trim().min(1, "captchaId 不能为空"),
  code: z.string().trim().min(1, "验证码不能为空"),
})

// === 在线用户 ===
export const forceLogoutSchema = z.object({
  sessionId: z.string().min(1, "sessionId 不能为空"),
})

// === OAuth2 ===
export const oauth2OpenTokenSchema = z.object({
  clientId: z.string().trim().min(1, "clientId 不能为空"),
  clientSecret: z.string().trim().min(1, "clientSecret 不能为空"),
  grantType: z.enum(["password", "client_credentials"]).default("password"),
  username: z.string().trim().optional(),
  password: z.string().trim().optional(),
})

export const oauth2UserInfoSchema = z.object({
  accessToken: z.string().trim().min(1, "accessToken 不能为空"),
})

// === 权限分配 ===
export const assignUserRoleSchema = z.object({
  userId: z.string().trim().min(1, "userId 不能为空"),
  roleIds: z.array(z.string().trim().min(1)).max(50),
})

export const assignRoleMenuSchema = z.object({
  roleId: z.string().trim().min(1, "roleId 不能为空"),
  menuIds: z.array(z.string().trim().min(1)).max(200),
})

// === 租户 ===
export const updateTenantStatusSchema = z.object({
  tenantId: z.string().trim().min(1, "tenantId 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]),
})

export const assignTenantPackageSchema = z.object({
  tenantId: z.string().trim().min(1, "tenantId 不能为空"),
  packageId: z.string().trim().min(1, "packageId 不能为空"),
})

// === 字典 ===
export const createDictItemSchema = z.object({
  dictType: z.string().trim().min(1, "dictType 不能为空"),
  label: z.string().trim().min(1, "label 不能为空"),
  value: z.string().trim().min(1, "value 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

// === 通知 ===
export const createNoticeSchema = z.object({
  title: z.string().trim().min(1, "title 不能为空"),
  content: z.string().trim().min(1, "content 不能为空"),
  type: z.enum(["INFO", "WARN", "ALERT"]).default("INFO"),
})

export const createNotifyTemplateSchema = z.object({
  code: z.string().trim().min(1, "code 不能为空"),
  name: z.string().trim().min(1, "name 不能为空"),
  channel: z.enum(["SITE", "SMS", "MAIL"]).default("SITE"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const createNotifyMessageSchema = z.object({
  templateCode: z.string().trim().min(1, "templateCode 不能为空"),
  receiver: z.string().trim().min(1, "receiver 不能为空"),
  status: z.enum(["SUCCESS", "FAIL"]).default("SUCCESS"),
})

// === 日志查询 ===
export const loginLogQuerySchema = pageQuerySchema.extend({
  result: z.enum(["SUCCESS", "FAIL"]).optional(),
})

export const operateLogQuerySchema = pageQuerySchema.extend({
  module: z.string().trim().max(100).optional(),
})

// === 短信/邮件/社交 ===
export const createSmsChannelSchema = z.object({
  name: z.string().trim().min(1, "name 不能为空"),
  signName: z.string().trim().min(1, "signName 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const createMailAccountSchema = z.object({
  email: z.string().trim().email("邮箱格式不正确"),
  host: z.string().trim().min(1, "host 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

export const createSocialUserSchema = z.object({
  provider: z.enum(["WECHAT", "DOUYIN", "WEIBO"]),
  nickname: z.string().trim().min(1, "nickname 不能为空"),
  externalId: z.string().trim().min(1, "externalId 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
})

// === 用户管理 CRUD ===
export const createUserSchema = z.object({
  username: z.string().trim().min(2, "用户名至少 2 个字符").max(30),
  nickname: z.string().trim().min(1, "昵称不能为空").max(30),
  password: z.string().trim().min(6, "密码至少 6 位").max(32),
  phone: z.string().trim().max(20).optional(),
  email: z.string().trim().email("邮箱格式不正确").optional().or(z.literal("")),
  deptId: z.string().trim().optional(),
  postIds: z.array(z.string().trim()).max(10).optional(),
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
  postIds: z.array(z.string().trim()).max(10).optional(),
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

// === Type exports ===
export type PageQueryInput = z.infer<typeof pageQuerySchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateUserPasswordInput = z.infer<typeof updateUserPasswordSchema>
export type DeleteUserInput = z.infer<typeof deleteUserSchema>
export type UserListQueryInput = z.infer<typeof userListQuerySchema>
export type SystemModulePageQueryInput = z.infer<typeof systemModulePageQuerySchema>
export type ForceLogoutInput = z.infer<typeof forceLogoutSchema>
export type AssignUserRoleInput = z.infer<typeof assignUserRoleSchema>
export type AssignRoleMenuInput = z.infer<typeof assignRoleMenuSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CaptchaVerifyInput = z.infer<typeof captchaVerifySchema>
export type Oauth2OpenTokenInput = z.infer<typeof oauth2OpenTokenSchema>
export type Oauth2UserInfoInput = z.infer<typeof oauth2UserInfoSchema>
export type UpdateTenantStatusInput = z.infer<typeof updateTenantStatusSchema>
export type AssignTenantPackageInput = z.infer<typeof assignTenantPackageSchema>
export type CreateDictItemInput = z.infer<typeof createDictItemSchema>
export type CreateNoticeInput = z.infer<typeof createNoticeSchema>
export type CreateNotifyTemplateInput = z.infer<typeof createNotifyTemplateSchema>
export type CreateNotifyMessageInput = z.infer<typeof createNotifyMessageSchema>
export type LoginLogQueryInput = z.infer<typeof loginLogQuerySchema>
export type OperateLogQueryInput = z.infer<typeof operateLogQuerySchema>
export type CreateSmsChannelInput = z.infer<typeof createSmsChannelSchema>
export type CreateMailAccountInput = z.infer<typeof createMailAccountSchema>
export type CreateSocialUserInput = z.infer<typeof createSocialUserSchema>

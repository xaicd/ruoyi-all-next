import { z } from "zod"

// === 租户 ===
export const updateTenantStatusSchema = z.object({
  tenantId: z.string().trim().min(1, "tenantId 不能为空"),
  status: z.enum(["ACTIVE", "DISABLED"]),
})

export const assignTenantPackageSchema = z.object({
  tenantId: z.string().trim().min(1, "tenantId 不能为空"),
  packageId: z.string().trim().min(1, "packageId 不能为空"),
})

/** 创建租户时必须同时建立首个租户管理员，避免产生无法登录管理的孤立租户。 */
export const tenantCodeSchema = z.string().trim().toLowerCase().min(2, "租户编码至少 2 位").max(32).regex(/^[a-z][a-z0-9-]*[a-z0-9]$/, "租户编码仅支持小写字母、数字和连字符，且必须以字母开头和结尾")

export const createTenantWithAdminSchema = z.object({
  tenantCode: tenantCodeSchema,
  name: z.string().trim().min(1, "租户名称不能为空").max(50),
  contactName: z.string().trim().max(30).optional(),
  contactPhone: z.string().trim().max(20).optional(),
  domain: z.string().trim().max(100).optional(),
  packageId: z.string().trim().min(1, "请选择套餐"),
  status: z.enum(["ACTIVE", "DISABLED"]).default("ACTIVE"),
  expireTime: z.string().datetime().optional(),
  accountCount: z.coerce.number().int().min(1, "账号额度至少为 1").default(1),
  adminUsername: z.string().trim().min(3, "管理员账号至少 3 位").max(30).regex(/^[A-Za-z0-9_-]+$/, "管理员账号仅支持字母、数字、下划线和连字符"),
  adminNickname: z.string().trim().min(1, "管理员昵称不能为空").max(30),
  adminPassword: z.string().min(6, "管理员密码至少 6 位").max(100),
  adminPhone: z.string().trim().max(20).optional(),
  adminEmail: z.string().trim().email("管理员邮箱格式不正确").max(50).optional(),
})

export type UpdateTenantStatusInput = z.infer<typeof updateTenantStatusSchema>
export type AssignTenantPackageInput = z.infer<typeof assignTenantPackageSchema>
export type CreateTenantWithAdminInput = z.infer<typeof createTenantWithAdminSchema>

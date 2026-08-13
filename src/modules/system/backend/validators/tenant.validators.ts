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

export type UpdateTenantStatusInput = z.infer<typeof updateTenantStatusSchema>
export type AssignTenantPackageInput = z.infer<typeof assignTenantPackageSchema>

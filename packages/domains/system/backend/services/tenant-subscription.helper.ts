/**
 * Tenant Subscription & Validation Helpers
 */

import { SystemTenantRepository } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository } from "@/modules/system/backend/repositories/tenant-package.repository"
import { SystemUserRepository } from "@/modules/system/backend/repositories/user.repository"

export type TenantUpdateInput = {
  id: string
  name?: string
  contactName?: string
  contactPhone?: string
  domain?: string
  packageId?: string
  status?: string
  effectiveAt?: string
  expireTime?: string | null
  accountLimit?: number | null
  createdBy?: string
}

export async function requireActivePackage(packageId: string | undefined): Promise<void> {
  if (!packageId) return
  const pkg = await TenantPackageRepository.findById(packageId)
  if (!pkg) throw new Error(`套餐不存在: ${packageId}`)
  if (pkg.status !== "ACTIVE") throw new Error(`套餐已停用: ${pkg.name}`)
}

export function normalizeTenantCode(code: string): string {
  return code.trim().toLowerCase()
}

export function tenantAdminRoleCode(tenantCode: string): string {
  return `tenant-admin-${tenantCode}`
}

export async function requireAvailableTenantCode(tenantCode: string, currentTenantId?: string): Promise<void> {
  const existing = await SystemTenantRepository.findByTenantCode(normalizeTenantCode(tenantCode))
  if (existing && existing.id !== currentTenantId) throw new Error(`租户编码已存在: ${tenantCode}`)
}

export async function enrichTenantEntitlements<T extends { id: string; packageId: string | null; accountLimit: number | null }>(
  value: T | T[]
): Promise<(T & { packageName: string | null; accountUsed: number; effectiveAccountLimit: number | null }) | Array<T & { packageName: string | null; accountUsed: number; effectiveAccountLimit: number | null }>> {
  const packages = new Map((await TenantPackageRepository.findAll()).map((pkg) => [pkg.id, pkg]))
  const enrich = async (tenant: T) => {
    const pkg = tenant.packageId ? packages.get(tenant.packageId) : undefined
    return {
      ...tenant,
      packageName: pkg?.name ?? null,
      accountUsed: await SystemUserRepository.count({ tenantId: tenant.id }),
      effectiveAccountLimit: tenant.accountLimit ?? pkg?.accountLimit ?? null,
    }
  }
  return Array.isArray(value) ? Promise.all(value.map(enrich)) : enrich(value)
}

export function defaultExpireTime(effectiveAt: Date): Date {
  const expireAt = new Date(effectiveAt)
  expireAt.setUTCFullYear(expireAt.getUTCFullYear() + 10)
  return expireAt
}

export function validateSubscriptionWindow(effectiveAt: string, expireTime: string | null | undefined): void {
  if (Number.isNaN(new Date(effectiveAt).getTime())) throw new Error("生效时间格式无效")
  if (expireTime && new Date(effectiveAt).getTime() >= new Date(expireTime).getTime()) throw new Error("过期时间必须晚于生效时间")
}

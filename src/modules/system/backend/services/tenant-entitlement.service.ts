import { SystemTenantRepository, type SystemTenantRow } from "@/modules/system/backend/repositories/tenant.repository"
import { TenantPackageRepository, type TenantPackageRow } from "@/modules/system/backend/repositories/tenant-package.repository"
import type { ResolveTenantEntitlementInput } from "../validators"

export type TenantEntitlement = {
  tenant: SystemTenantRow
  package: TenantPackageRow
  accountLimit: number | null
}

function asMillis(value: string): number {
  return new Date(value).getTime()
}

/** Resolves and validates the current tenant subscription in one place. */
export class TenantEntitlementService {
  static async resolveTenantEntitlement(input: ResolveTenantEntitlementInput) {
    return this.resolve(input.tenantId)
  }

  static async resolve(tenantId: string, now = new Date()): Promise<TenantEntitlement> {
    const tenant = await SystemTenantRepository.findById(tenantId)
    if (!tenant) throw new Error("租户不存在")
    if (tenant.status !== "ACTIVE") throw new Error("租户已停用")
    if (asMillis(tenant.effectiveAt) > now.getTime()) throw new Error("租户尚未生效")
    if (tenant.expireTime && asMillis(tenant.expireTime) <= now.getTime()) throw new Error("租户已过期")
    if (!tenant.packageId) throw new Error("租户未分配套餐")
    const pkg = await TenantPackageRepository.findById(tenant.packageId)
    if (!pkg || pkg.status !== "ACTIVE") throw new Error("租户套餐不可用")
    return { tenant, package: pkg, accountLimit: tenant.accountLimit ?? pkg.accountLimit }
  }

  static async requireUserCapacity(tenantId: string, currentCount: number): Promise<TenantEntitlement> {
    const entitlement = await this.resolve(tenantId)
    if (entitlement.accountLimit !== null && currentCount >= entitlement.accountLimit) {
      throw new Error(`租户账号席位已用尽（${currentCount}/${entitlement.accountLimit}）`)
    }
    return entitlement
  }
}

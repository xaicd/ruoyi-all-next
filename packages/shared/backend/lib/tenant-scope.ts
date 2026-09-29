import { getCurrentTenantId, getTenantContext, isPlatformContext, isTenantRequired } from "./biz-tenant"

/**
 * Enforces repository ownership. Tenant-owned repositories must use this
 * before read/write operations; platform-only repositories must call
 * assertPlatformScope instead.
 */
export function requireTenantId(): string {
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired()) throw new Error("租户数据访问缺少 tenantId")
  return ""
}

export function assertPlatformScope(): void {
  if (isTenantRequired() && !isPlatformContext()) {
    throw new Error("仅平台管理员可访问全局租户控制面")
  }
}

export function hasTenantScope(): boolean {
  return Boolean(getTenantContext()?.tenantId)
}

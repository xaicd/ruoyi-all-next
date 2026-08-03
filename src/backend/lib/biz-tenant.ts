type TenantContext = {
  tenantId: string
  // tenant-package 对齐 yudao-boot-mini 的租户套餐语义。
  tenantPackageId: string
}

let CURRENT_TENANT: TenantContext | null = null

export function setTenantContext(context: TenantContext) {
  CURRENT_TENANT = context
}

export function getTenantContext() {
  return CURRENT_TENANT
}

export function clearTenantContext() {
  CURRENT_TENANT = null
}

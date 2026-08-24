/**
 * 数据权限范围与多租户/代理商数据范围拦截器 (Data Scope Interceptor)
 * 遵循 RuoYi 经典 5 级数据范围 + 顶级代理商跨租户数据筛选标准
 */

export type DataScopeType =
  | "ALL"               // 1: 全部数据权限 (平台超级管理员)
  | "CUSTOM"            // 2: 自定义/代理商授权租户集 (顶级代理商 master_partner)
  | "DEPT"              // 3: 本部门数据权限 (单位管理员 enterprise_admin)
  | "DEPT_AND_CHILD"    // 4: 本部门及以下数据权限 (客户经理 aigw_manager)
  | "SELF"              // 5: 仅本人数据权限 (普通协同员工 cpc_employee)

export type PartnerDataScope = {
  scopeType: DataScopeType
  partnerId?: string
  allowedTenantIds?: string[]
}

/**
 * 判定当前操作是否具备目标租户的数据访问权限
 */
export function hasTenantAccessPermission(
  scope: PartnerDataScope,
  targetTenantId: string
): boolean {
  if (scope.scopeType === "ALL") return true
  if (scope.allowedTenantIds && scope.allowedTenantIds.length > 0) {
    return scope.allowedTenantIds.includes(targetTenantId)
  }
  return false
}

/**
 * 为 Kysely / 内存 Repository 查询自动注入代理商数据权限过滤条件
 */
export function filterTenantsByDataScope<T extends { id?: string; tenantId?: string }>(
  items: T[],
  scope: PartnerDataScope
): T[] {
  if (scope.scopeType === "ALL") return items

  if (scope.allowedTenantIds && scope.allowedTenantIds.length > 0) {
    const set = new Set(scope.allowedTenantIds)
    return items.filter((item) => {
      const tid = item.id || item.tenantId
      return tid ? set.has(tid) : false
    })
  }

  return []
}

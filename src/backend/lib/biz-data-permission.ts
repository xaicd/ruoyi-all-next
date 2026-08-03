type DataPermissionScope = {
  orgCodes: string[]
  selfOnly?: boolean
}

export function buildDataPermissionScope(orgCodePrefix: string): DataPermissionScope {
  return {
    orgCodes: [orgCodePrefix],
  }
}

export function hasDataPermission(scope: DataPermissionScope, targetOrgCode: string) {
  return scope.orgCodes.some((code) => targetOrgCode.startsWith(code))
}

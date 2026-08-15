import type { PermissionCode } from "@/modules/shared/backend/constants/permissions"

export const {{featureListPascal}}Permissions = {
  query: "{{permissionPrefix}}:query",
  create: "{{permissionPrefix}}:create",
  update: "{{permissionPrefix}}:update",
  delete: "{{permissionPrefix}}:delete",
} as const

// Register these codes in the menu/button-permission catalog before deployment.
export const {{featureListPascal}}PermissionCodes = {{featureListPascal}}Permissions as unknown as Record<keyof typeof {{featureListPascal}}Permissions, PermissionCode>

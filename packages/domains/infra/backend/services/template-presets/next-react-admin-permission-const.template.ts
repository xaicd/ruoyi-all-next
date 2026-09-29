export const nextReactAdminPermissionConstTemplate = `export const {{entityName}}Permissions = {
  view: "{{permissionView}}",
  create: "{{permissionUpdate}}",
  update: "{{permissionUpdate}}",
  delete: "{{permissionUpdate}}",
} as const

export type {{entityName}}Permission =
  (typeof {{entityName}}Permissions)[keyof typeof {{entityName}}Permissions]
`
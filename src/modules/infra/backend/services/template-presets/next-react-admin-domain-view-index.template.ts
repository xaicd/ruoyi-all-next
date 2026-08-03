export const nextReactAdminDomainViewIndexTemplate = `export const {{entityName}}DomainViewMap = {
  root: "/admin/{{modulePath}}/domain",
  list: "/admin/{{modulePath}}/domain/list",
  detail: "/admin/{{modulePath}}/domain/detail",
} as const
`
export const nextReactAdminDomainApiIndexTemplate = `export const {{entityName}}DomainApiMap = {
  root: "/api/admin/{{modulePath}}",
  list: "/api/admin/{{modulePath}}/domain/list",
  detail: "/api/admin/{{modulePath}}/domain/detail",
  metrics: "/api/admin/{{modulePath}}/domain/metrics",
} as const
`
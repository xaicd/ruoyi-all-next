export const nextReactAdminRouteIndexTemplate = `export const {{entityName}}AdminRouteMap = {
  list: "/api/admin/{{modulePath}}",
  tree: "/api/admin/{{modulePath}}/tree",
  workflow: "/api/admin/{{modulePath}}/workflow",
  domainSummary: "/api/admin/{{modulePath}}/domain/summary",
  domainReindex: "/api/admin/{{modulePath}}/domain/reindex",
} as const
`
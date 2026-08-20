export const nextReactAdminRouteIndexTemplate = `export const {{entityName}}AdminRouteMap = {
  list: "{{apiBase}}",
  tree: "{{apiBase}}/tree",
  workflow: "{{apiBase}}/workflow",
  domainSummary: "{{apiBase}}/domain/summary",
  domainReindex: "{{apiBase}}/domain/reindex",
} as const
`

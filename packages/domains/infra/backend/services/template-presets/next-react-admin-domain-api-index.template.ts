export const nextReactAdminDomainApiIndexTemplate = `export const {{entityName}}DomainApiMap = {
  root: "{{apiBase}}",
  list: "{{apiBase}}/domain/list",
  detail: "{{apiBase}}/domain/detail",
  metrics: "{{apiBase}}/domain/metrics",
} as const
`

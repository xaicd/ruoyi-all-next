export const nextReactAdminDomainTypesIndexTemplate = `export interface {{entityName}}DomainItem {
  code: string
  name: string
  status: "ACTIVE" | "DISABLED"
}

export interface {{entityName}}DomainStats {
  total: number
  active: number
  disabled: number
}

export interface {{entityName}}DomainPageData {
  items: {{entityName}}DomainItem[]
  stats: {{entityName}}DomainStats
}
`
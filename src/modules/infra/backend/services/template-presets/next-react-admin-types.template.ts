export const nextReactAdminTypesTemplate = `export interface {{entityName}}Item {
  id: string
  name: string
  status: "ACTIVE" | "DISABLED"
}

export interface {{entityName}}PageResponse {
  items: {{entityName}}Item[]
  total: number
  page: number
  pageSize: number
}
`

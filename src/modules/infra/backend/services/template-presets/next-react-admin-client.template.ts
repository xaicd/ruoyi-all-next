export const nextReactAdminClientTemplate = `import { api } from "@/frontend/services/api-client"

export interface {{entityName}}ListItem {
  id: string
  name: string
}

export async function list{{entityName}}(keyword?: string) {
  const query = keyword ? "?keyword=" + keyword : ""
  return api.get<{ items: {{entityName}}ListItem[]; total: number }>("/api/admin/{{modulePath}}" + query)
}
`

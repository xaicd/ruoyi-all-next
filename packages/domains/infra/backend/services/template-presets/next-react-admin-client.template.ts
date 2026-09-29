export const nextReactAdminClientTemplate = `import { request } from "@/modules/shared/frontend/lib/request"

export interface {{entityName}}ListItem {
  id: string
  name: string
}

const BASE = "{{apiBase}}"

export async function list{{entityName}}(keyword?: string) {
  return request.get<{ items: {{entityName}}ListItem[]; total: number }>(BASE, keyword ? { keyword } : undefined)
}
`

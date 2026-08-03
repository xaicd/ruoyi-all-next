export const nextReactAdminDomainClientTemplate = `import { api } from "@/frontend/services/api-client"

export interface {{entityName}}DomainSummary {
  code: string
  name: string
  itemCount: number
}

const DOMAIN_BASE = "/api/admin/{{modulePath}}"

export async function get{{entityName}}DomainSummary() {
  return api.get<{{entityName}}DomainSummary[]>(DOMAIN_BASE + "/domain/summary")
}

export async function refresh{{entityName}}DomainIndex() {
  return api.post<{ success: true }>(DOMAIN_BASE + "/domain/reindex", {})
}
`
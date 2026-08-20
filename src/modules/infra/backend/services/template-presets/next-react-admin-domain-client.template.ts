export const nextReactAdminDomainClientTemplate = `import { request } from "@/modules/shared/frontend/lib/request"

export interface {{entityName}}DomainSummary {
  code: string
  name: string
  itemCount: number
}

const DOMAIN_BASE = "{{apiBase}}"

export async function get{{entityName}}DomainSummary() {
  return request.get<{{entityName}}DomainSummary[]>(DOMAIN_BASE + "/domain/summary")
}

export async function refresh{{entityName}}DomainIndex() {
  return request.post<{ success: true }>(DOMAIN_BASE + "/domain/reindex", {})
}
`

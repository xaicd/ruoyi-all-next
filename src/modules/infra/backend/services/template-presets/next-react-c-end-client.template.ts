export const nextReactCEndClientTemplate = `import { api } from "@/frontend/services/api-client"

export async function list{{entityName}}ForUser(params?: { page?: number; pageSize?: number }) {
  const query = new URLSearchParams()
  if (params?.page) query.set("page", String(params.page))
  if (params?.pageSize) query.set("pageSize", String(params.pageSize))
  const suffix = query.size ? "?" + query.toString() : ""
  return api.get<{ items: unknown[]; total: number }>("/api/{{modulePath}}" + suffix)
}
`

export const nextReactCEndClientTemplate = `import { request } from "@/modules/shared/frontend/lib/request"

export async function list{{entityName}}ForUser(params?: { page?: number; pageSize?: number }) {
  return request.get<{ items: unknown[]; total: number }>("/api/v1/app/{{modulePath}}", params)
}
`

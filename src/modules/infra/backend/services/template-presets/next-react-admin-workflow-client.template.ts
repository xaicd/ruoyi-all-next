export const nextReactAdminWorkflowClientTemplate = `import { request } from "@/modules/shared/frontend/lib/request"

export async function list{{entityName}}Workflows() {
  return request.get<{ items: unknown[]; total: number }>("{{apiBase}}/workflow")
}

export async function create{{entityName}}Workflow(input: { title: string; remark?: string }) {
  return request.post<unknown>("{{apiBase}}/workflow", input)
}

export async function audit{{entityName}}Workflow(input: { id: string; action: "APPROVE" | "REJECT"; reason?: string }) {
  return request.patch<unknown>("{{apiBase}}/workflow", input)
}
`

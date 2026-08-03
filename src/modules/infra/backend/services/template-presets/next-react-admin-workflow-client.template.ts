export const nextReactAdminWorkflowClientTemplate = `import { api } from "@/frontend/services/api-client"

export async function list{{entityName}}Workflows() {
  return api.get<{ items: unknown[]; total: number }>("/api/admin/{{modulePath}}/workflow")
}

export async function create{{entityName}}Workflow(input: { title: string; remark?: string }) {
  return api.post<unknown>("/api/admin/{{modulePath}}/workflow", input)
}

export async function audit{{entityName}}Workflow(input: { id: string; action: "APPROVE" | "REJECT"; reason?: string }) {
  return api.patch<unknown>("/api/admin/{{modulePath}}/workflow", input)
}
`

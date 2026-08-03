export const nextReactAdminTreeClientTemplate = `import { api } from "@/frontend/services/api-client"

export async function list{{entityName}}Tree() {
  return api.get<unknown[]>("/api/admin/{{modulePath}}/tree")
}

export async function move{{entityName}}TreeNode(input: { id: string; targetParentId: string | null }) {
  return api.patch<{ success: boolean }>("/api/admin/{{modulePath}}/tree", input)
}
`

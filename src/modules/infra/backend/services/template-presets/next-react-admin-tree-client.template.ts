export const nextReactAdminTreeClientTemplate = `import { request } from "@/modules/shared/frontend/lib/request"

export async function list{{entityName}}Tree() {
  return request.get<unknown[]>("{{apiBase}}/tree")
}

export async function move{{entityName}}TreeNode(input: { id: string; targetParentId: string | null }) {
  return request.patch<{ success: boolean }>("{{apiBase}}/tree", input)
}
`

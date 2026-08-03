export const nextReactMerchantClientTemplate = `import { api } from "@/frontend/services/api-client"

export async function list{{entityName}}ForMerchant(keyword?: string) {
  const query = keyword ? "?keyword=" + encodeURIComponent(keyword) : ""
  return api.get<{ items: unknown[]; total: number }>("/api/merchant/{{modulePath}}" + query)
}
`

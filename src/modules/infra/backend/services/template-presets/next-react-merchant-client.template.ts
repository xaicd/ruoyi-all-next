export const nextReactMerchantClientTemplate = `import { request } from "@/modules/shared/frontend/lib/request"

export async function list{{entityName}}ForMerchant(keyword?: string) {
  return request.get<{ items: unknown[]; total: number }>("/api/v1/merchant/{{modulePath}}", keyword ? { keyword } : undefined)
}
`

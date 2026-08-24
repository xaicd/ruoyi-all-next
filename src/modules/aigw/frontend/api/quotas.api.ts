import { request } from "@/modules/shared/frontend/lib/request"

export function getQuotaPage(params?: any) {
  return request.get("/api/v1/admin/aigw/quotas", { params })
}

export const AigwQuotaApi = {
  page: (params?: any) => getQuotaPage(params).then((r: any) => ({ success: true, data: r })),
}

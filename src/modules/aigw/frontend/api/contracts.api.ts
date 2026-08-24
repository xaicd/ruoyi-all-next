import { request } from "@/modules/shared/frontend/lib/request"

export function getSettlementPage(params?: any) {
  return request.get("/api/v1/admin/aigw/contracts", { params })
}

export const AigwSettlementApi = {
  page: (params?: any) => getSettlementPage(params).then((r: any) => ({ success: true, data: r })),
}

import { request } from "@/modules/shared/frontend/lib/request"

export function getSettlementPage(params?: any) {
  return request.get("/api/v1/admin/aigw/contracts", { params })
}

export function createSettlement(data: any) {
  return request.post("/api/v1/admin/aigw/contracts", data)
}

export function updateSettlement(id: string, data: any) {
  return request.put(`/api/v1/admin/aigw/contracts?id=${id}`, data)
}

export function deleteSettlement(id: string) {
  return request.delete(`/api/v1/admin/aigw/contracts?id=${id}`)
}

export const AigwSettlementApi = {
  page: (params?: any) => getSettlementPage(params).then((r: any) => ({ success: true, data: r })),
  create: (data: any) => createSettlement(data),
  update: (id: string, data: any) => updateSettlement(id, data),
  delete: (id: string) => deleteSettlement(id),
}

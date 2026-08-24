import { request } from "@/modules/shared/frontend/lib/request"

export function getTariffPage(params?: any) {
  return request.get("/api/v1/admin/aigw/tariffs", { params })
}

export function createTariff(data: any) {
  return request.post("/api/v1/admin/aigw/tariffs", data)
}

export function updateTariff(id: string, data: any) {
  return request.put(`/api/v1/admin/aigw/tariffs?id=${id}`, data)
}

export function deleteTariff(id: string) {
  return request.delete(`/api/v1/admin/aigw/tariffs?id=${id}`)
}

export const AigwTariffApi = {
  page: (params?: any) => getTariffPage(params).then((r: any) => ({ success: true, data: r })),
  create: (data: any) => createTariff(data),
  update: (id: string, data: any) => updateTariff(id, data),
  delete: (id: string) => deleteTariff(id),
}

import { request } from "@/modules/shared/frontend/lib/request"

export function getSeatPage(params?: any) {
  return request.get("/api/v1/admin/aigw/seats", { params })
}

export function createSeat(data: any) {
  return request.post("/api/v1/admin/aigw/seats", data)
}

export function updateSeat(id: string, data: any) {
  return request.put(`/api/v1/admin/aigw/seats?id=${id}`, data)
}

export function deleteSeat(id: string) {
  return request.delete(`/api/v1/admin/aigw/seats?id=${id}`)
}

export const AigwSeatApi = {
  page: (params?: any) => getSeatPage(params).then((r: any) => ({ success: true, data: r })),
  create: (data: any) => createSeat(data),
  update: (id: string, data: any) => updateSeat(id, data),
  delete: (id: string) => deleteSeat(id),
}

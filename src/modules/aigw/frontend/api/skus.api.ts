import { request } from "@/modules/shared/frontend/lib/request"

export function getSkuPage(params?: any) {
  return request.get("/api/v1/admin/aigw/skus", { params })
}

export function createSku(data: any) {
  return request.post("/api/v1/admin/aigw/skus", data)
}

export function updateSku(id: string, data: any) {
  return request.put(`/api/v1/admin/aigw/skus?id=${id}`, data)
}

export function deleteSku(id: string) {
  return request.delete(`/api/v1/admin/aigw/skus?id=${id}`)
}

export const AigwSkuApi = {
  page: (params?: any) => getSkuPage(params).then((r: any) => ({ success: true, data: r })),
  create: (data: any) => createSku(data),
  update: (id: string, data: any) => updateSku(id, data),
  delete: (id: string) => deleteSku(id),
}

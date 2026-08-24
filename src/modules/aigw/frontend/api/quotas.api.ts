import { request } from "@/modules/shared/frontend/lib/request"

export function getQuotaPage(params?: any) {
  return request.get("/api/v1/admin/aigw/quotas", { params })
}

export function createQuota(data: any) {
  return request.post("/api/v1/admin/aigw/quotas", data)
}

export function updateQuota(id: string, data: any) {
  return request.put(`/api/v1/admin/aigw/quotas?id=${id}`, data)
}

export function deleteQuota(id: string) {
  return request.delete(`/api/v1/admin/aigw/quotas?id=${id}`)
}

export const AigwQuotaApi = {
  page: (params?: any) => getQuotaPage(params).then((r: any) => ({ success: true, data: r })),
  create: (data: any) => createQuota(data),
  update: (id: string, data: any) => updateQuota(id, data),
  delete: (id: string) => deleteQuota(id),
}

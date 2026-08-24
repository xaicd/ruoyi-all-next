import { request } from "@/modules/shared/frontend/lib/request"

export function getEnterprisePage(params?: any) {
  return request.get("/api/v1/admin/aigw/enterprises", { params })
}

export function createEnterprise(data: any) {
  return request.post("/api/v1/admin/aigw/enterprises", data)
}

export function updateEnterprise(id: string, data: any) {
  return request.put(`/api/v1/admin/aigw/enterprises?id=${id}`, data)
}

export function deleteEnterprise(id: string) {
  return request.delete(`/api/v1/admin/aigw/enterprises?id=${id}`)
}

export const AigwEnterpriseApi = {
  page: (params?: any) => getEnterprisePage(params).then((r: any) => ({ success: true, data: r })),
  create: (data: any) => createEnterprise(data),
  update: (id: string, data: any) => updateEnterprise(id, data),
  delete: (id: string) => deleteEnterprise(id),
}

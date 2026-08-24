import { request } from "@/modules/shared/frontend/lib/request"

export function getSplitPage(params?: any) {
  return request.get("/api/v1/admin/aigw/pipelines", { params })
}

export function createSplit(data: any) {
  return request.post("/api/v1/admin/aigw/pipelines", data)
}

export function updateSplit(id: string, data: any) {
  return request.put(`/api/v1/admin/aigw/pipelines?id=${id}`, data)
}

export function deleteSplit(id: string) {
  return request.delete(`/api/v1/admin/aigw/pipelines?id=${id}`)
}

export const AigwSplitApi = {
  page: (params?: any) => getSplitPage(params).then((r: any) => ({ success: true, data: r })),
  create: (data: any) => createSplit(data),
  update: (id: string, data: any) => updateSplit(id, data),
  delete: (id: string) => deleteSplit(id),
}

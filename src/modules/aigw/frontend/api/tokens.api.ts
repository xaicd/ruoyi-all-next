import { request } from "@/modules/shared/frontend/lib/request"

export const AigwTokenApi = {
  page: (params?: Record<string, any>) => request.get("/api/v1/admin/aigw/tokens", { params }),
  create: (data: any) => request.post("/api/v1/admin/aigw/tokens", data),
  update: (id: string, data: any) => request.put(`/api/v1/admin/aigw/tokens?id=${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/admin/aigw/tokens?id=${id}`),
}

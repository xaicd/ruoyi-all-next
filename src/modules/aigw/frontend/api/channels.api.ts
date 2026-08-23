import { request } from "@/modules/shared/frontend/lib/request"

export const AigwChannelApi = {
  page: (params?: Record<string, any>) => request.get("/api/v1/admin/aigw/channels", { params }),
  create: (data: any) => request.post("/api/v1/admin/aigw/channels", data),
  update: (id: string, data: any) => request.put(`/api/v1/admin/aigw/channels?id=${id}`, data),
  delete: (id: string) => request.delete(`/api/v1/admin/aigw/channels?id=${id}`),
}

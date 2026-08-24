import { request } from "@/modules/shared/frontend/lib/request"
import type { AigwSkuRow } from "@/modules/aigw/backend/repositories/aigw-sku.repository"

export const AigwSkuApi = {
  async page(params?: { page?: number; pageSize?: number; category?: string; keyword?: string }) {
    return request.get<{ items: AigwSkuRow[]; total: number }>("/api/v1/admin/aigw/skus", { params })
  },
  async create(data: Partial<AigwSkuRow>) {
    return request.post<AigwSkuRow>("/api/v1/admin/aigw/skus", data)
  },
  async update(id: string, data: Partial<AigwSkuRow>) {
    return request.put<AigwSkuRow>(`/api/v1/admin/aigw/skus?id=${id}`, data)
  },
  async delete(id: string) {
    return request.delete<void>(`/api/v1/admin/aigw/skus?id=${id}`)
  },
}

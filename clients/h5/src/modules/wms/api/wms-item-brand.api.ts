// Auto-generated H5 Client SDK for 物料品牌
import { request } from "@/shared/lib/request"

export interface WmsItemBrandItem {
  id: string
  name?: string
  code?: string
  logo?: string
  status?: string
  createTime?: string
}

export const WmsItemBrandH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsItemBrandItem[]; total: number }>("/api/v1/app/wms/wms-item-brand", { params })
  },
  async get(id: string) {
    return request.get<WmsItemBrandItem>(`/api/v1/app/wms/wms-item-brand/${id}`)
  },
}

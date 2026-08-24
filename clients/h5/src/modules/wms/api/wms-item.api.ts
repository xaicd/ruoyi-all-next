// Auto-generated H5 Client SDK for 物料主数据
import { request } from "@/shared/lib/request"

export interface WmsItemItem {
  id: string
  item_code?: string
  item_name?: string
  category_id?: string
  brand_id?: string
  createTime?: string
}

export const WmsItemH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsItemItem[]; total: number }>("/api/v1/app/wms/wms-item", { params })
  },
  async get(id: string) {
    return request.get<WmsItemItem>(`/api/v1/app/wms/wms-item/${id}`)
  },
}

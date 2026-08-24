// Auto-generated H5 Client SDK for 物料分类
import { request } from "@/shared/lib/request"

export interface WmsItemCategoryItem {
  id: string
  parent_id?: string
  name?: string
  code?: string
  sort?: number
  createTime?: string
}

export const WmsItemCategoryH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsItemCategoryItem[]; total: number }>("/api/v1/app/wms/wms-item-category", { params })
  },
  async get(id: string) {
    return request.get<WmsItemCategoryItem>(`/api/v1/app/wms/wms-item-category/${id}`)
  },
}

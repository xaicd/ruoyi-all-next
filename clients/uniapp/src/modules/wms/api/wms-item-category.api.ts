// Auto-generated UniApp SDK for 物料分类
import { request } from "@/shared/lib/request"

export interface WmsItemCategoryItem {
  id: string
  parent_id?: string
  name?: string
  code?: string
  sort?: number
  createTime?: string
}

export function fetchWmsItemCategoryList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsItemCategoryItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-item-category",
    method: "GET",
    data: params,
  })
}

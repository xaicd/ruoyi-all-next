// Auto-generated UniApp SDK for 物料主数据
import { request } from "@/shared/lib/request"

export interface WmsItemItem {
  id: string
  item_code?: string
  item_name?: string
  category_id?: string
  brand_id?: string
  createTime?: string
}

export function fetchWmsItemList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsItemItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-item",
    method: "GET",
    data: params,
  })
}

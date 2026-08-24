// Auto-generated UniApp SDK for 物料品牌
import { request } from "@/shared/lib/request"

export interface WmsItemBrandItem {
  id: string
  name?: string
  code?: string
  logo?: string
  status?: string
  createTime?: string
}

export function fetchWmsItemBrandList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsItemBrandItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-item-brand",
    method: "GET",
    data: params,
  })
}

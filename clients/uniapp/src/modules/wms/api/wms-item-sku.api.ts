// Auto-generated UniApp SDK for 物料SKU
import { request } from "@/shared/lib/request"

export interface WmsItemSkuItem {
  id: string
  item_id?: string
  sku_code?: string
  sku_name?: string
  barcode?: string
  createTime?: string
}

export function fetchWmsItemSkuList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsItemSkuItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-item-sku",
    method: "GET",
    data: params,
  })
}

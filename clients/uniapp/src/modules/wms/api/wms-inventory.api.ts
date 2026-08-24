// Auto-generated UniApp SDK for 实时库存
import { request } from "@/shared/lib/request"

export interface WmsInventoryItem {
  id: string
  warehouse_id?: string
  item_id?: string
  merchant_id?: string
  qty?: number
  createTime?: string
}

export function fetchWmsInventoryList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsInventoryItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-inventory",
    method: "GET",
    data: params,
  })
}

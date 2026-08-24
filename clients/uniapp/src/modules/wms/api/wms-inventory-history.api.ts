// Auto-generated UniApp SDK for 库存流水
import { request } from "@/shared/lib/request"

export interface WmsInventoryHistoryItem {
  id: string
  warehouse_id?: string
  item_id?: string
  change_type?: string
  qty_change?: number
  createTime?: string
}

export function fetchWmsInventoryHistoryList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsInventoryHistoryItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-inventory-history",
    method: "GET",
    data: params,
  })
}

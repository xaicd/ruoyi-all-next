// Auto-generated UniApp SDK for 移库单
import { request } from "@/shared/lib/request"

export interface WmsMovementOrderItem {
  id: string
  order_no?: string
  from_warehouse_id?: string
  to_warehouse_id?: string
  total_qty?: number
  createTime?: string
}

export function fetchWmsMovementOrderList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsMovementOrderItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-movement-order",
    method: "GET",
    data: params,
  })
}

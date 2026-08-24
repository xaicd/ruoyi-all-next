// Auto-generated UniApp SDK for 移库明细
import { request } from "@/shared/lib/request"

export interface WmsMovementOrderDetailItem {
  id: string
  movement_order_id?: string
  item_id?: string
  qty?: number
  createTime?: string
}

export function fetchWmsMovementOrderDetailList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsMovementOrderDetailItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-movement-order-detail",
    method: "GET",
    data: params,
  })
}

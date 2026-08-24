// Auto-generated UniApp SDK for 盘点明细
import { request } from "@/shared/lib/request"

export interface WmsCheckOrderDetailItem {
  id: string
  check_order_id?: string
  item_id?: string
  system_qty?: number
  check_qty?: number
  createTime?: string
}

export function fetchWmsCheckOrderDetailList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsCheckOrderDetailItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-check-order-detail",
    method: "GET",
    data: params,
  })
}

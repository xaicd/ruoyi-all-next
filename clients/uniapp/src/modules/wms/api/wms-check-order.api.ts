// Auto-generated UniApp SDK for 盘点单
import { request } from "@/shared/lib/request"

export interface WmsCheckOrderItem {
  id: string
  order_no?: string
  warehouse_id?: string
  check_type?: string
  status?: string
  createTime?: string
}

export function fetchWmsCheckOrderList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsCheckOrderItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-check-order",
    method: "GET",
    data: params,
  })
}

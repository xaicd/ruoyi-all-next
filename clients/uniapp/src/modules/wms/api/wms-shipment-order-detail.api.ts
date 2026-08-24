// Auto-generated UniApp SDK for 出库明细
import { request } from "@/shared/lib/request"

export interface WmsShipmentOrderDetailItem {
  id: string
  shipment_order_id?: string
  item_id?: string
  plan_qty?: number
  real_qty?: number
  createTime?: string
}

export function fetchWmsShipmentOrderDetailList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsShipmentOrderDetailItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-shipment-order-detail",
    method: "GET",
    data: params,
  })
}

// Auto-generated UniApp SDK for 出库单
import { request } from "@/shared/lib/request"

export interface WmsShipmentOrderItem {
  id: string
  order_no?: string
  shipment_type?: string
  warehouse_id?: string
  merchant_id?: string
  createTime?: string
}

export function fetchWmsShipmentOrderList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsShipmentOrderItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-shipment-order",
    method: "GET",
    data: params,
  })
}

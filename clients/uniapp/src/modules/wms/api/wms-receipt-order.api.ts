// Auto-generated UniApp SDK for 入库单
import { request } from "@/shared/lib/request"

export interface WmsReceiptOrderItem {
  id: string
  order_no?: string
  receipt_type?: string
  warehouse_id?: string
  merchant_id?: string
  createTime?: string
}

export function fetchWmsReceiptOrderList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsReceiptOrderItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-receipt-order",
    method: "GET",
    data: params,
  })
}

// Auto-generated UniApp SDK for 入库明细
import { request } from "@/shared/lib/request"

export interface WmsReceiptOrderDetailItem {
  id: string
  receipt_order_id?: string
  item_id?: string
  plan_qty?: number
  real_qty?: number
  createTime?: string
}

export function fetchWmsReceiptOrderDetailList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsReceiptOrderDetailItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-receipt-order-detail",
    method: "GET",
    data: params,
  })
}

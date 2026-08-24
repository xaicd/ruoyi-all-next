// Auto-generated H5 Client SDK for 入库明细
import { request } from "@/shared/lib/request"

export interface WmsReceiptOrderDetailItem {
  id: string
  receipt_order_id?: string
  item_id?: string
  plan_qty?: number
  real_qty?: number
  createTime?: string
}

export const WmsReceiptOrderDetailH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsReceiptOrderDetailItem[]; total: number }>("/api/v1/app/wms/wms-receipt-order-detail", { params })
  },
  async get(id: string) {
    return request.get<WmsReceiptOrderDetailItem>(`/api/v1/app/wms/wms-receipt-order-detail/${id}`)
  },
}

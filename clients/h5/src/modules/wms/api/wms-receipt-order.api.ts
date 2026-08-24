// Auto-generated H5 Client SDK for 入库单
import { request } from "@/shared/lib/request"

export interface WmsReceiptOrderItem {
  id: string
  order_no?: string
  receipt_type?: string
  warehouse_id?: string
  merchant_id?: string
  createTime?: string
}

export const WmsReceiptOrderH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsReceiptOrderItem[]; total: number }>("/api/v1/app/wms/wms-receipt-order", { params })
  },
  async get(id: string) {
    return request.get<WmsReceiptOrderItem>(`/api/v1/app/wms/wms-receipt-order/${id}`)
  },
}

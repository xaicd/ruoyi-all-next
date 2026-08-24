// Auto-generated H5 Client SDK for 盘点明细
import { request } from "@/shared/lib/request"

export interface WmsCheckOrderDetailItem {
  id: string
  check_order_id?: string
  item_id?: string
  system_qty?: number
  check_qty?: number
  createTime?: string
}

export const WmsCheckOrderDetailH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsCheckOrderDetailItem[]; total: number }>("/api/v1/app/wms/wms-check-order-detail", { params })
  },
  async get(id: string) {
    return request.get<WmsCheckOrderDetailItem>(`/api/v1/app/wms/wms-check-order-detail/${id}`)
  },
}

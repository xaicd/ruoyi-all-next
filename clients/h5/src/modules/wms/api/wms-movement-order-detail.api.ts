// Auto-generated H5 Client SDK for 移库明细
import { request } from "@/shared/lib/request"

export interface WmsMovementOrderDetailItem {
  id: string
  movement_order_id?: string
  item_id?: string
  qty?: number
  createTime?: string
}

export const WmsMovementOrderDetailH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsMovementOrderDetailItem[]; total: number }>("/api/v1/app/wms/wms-movement-order-detail", { params })
  },
  async get(id: string) {
    return request.get<WmsMovementOrderDetailItem>(`/api/v1/app/wms/wms-movement-order-detail/${id}`)
  },
}

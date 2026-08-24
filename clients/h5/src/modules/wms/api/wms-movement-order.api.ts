// Auto-generated H5 Client SDK for 移库单
import { request } from "@/shared/lib/request"

export interface WmsMovementOrderItem {
  id: string
  order_no?: string
  from_warehouse_id?: string
  to_warehouse_id?: string
  total_qty?: number
  createTime?: string
}

export const WmsMovementOrderH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsMovementOrderItem[]; total: number }>("/api/v1/app/wms/wms-movement-order", { params })
  },
  async get(id: string) {
    return request.get<WmsMovementOrderItem>(`/api/v1/app/wms/wms-movement-order/${id}`)
  },
}

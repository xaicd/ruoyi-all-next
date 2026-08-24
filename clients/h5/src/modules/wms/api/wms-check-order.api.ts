// Auto-generated H5 Client SDK for 盘点单
import { request } from "@/shared/lib/request"

export interface WmsCheckOrderItem {
  id: string
  order_no?: string
  warehouse_id?: string
  check_type?: string
  status?: string
  createTime?: string
}

export const WmsCheckOrderH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsCheckOrderItem[]; total: number }>("/api/v1/app/wms/wms-check-order", { params })
  },
  async get(id: string) {
    return request.get<WmsCheckOrderItem>(`/api/v1/app/wms/wms-check-order/${id}`)
  },
}

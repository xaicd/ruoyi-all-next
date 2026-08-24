// Auto-generated H5 Client SDK for 实时库存
import { request } from "@/shared/lib/request"

export interface WmsInventoryItem {
  id: string
  warehouse_id?: string
  item_id?: string
  merchant_id?: string
  qty?: number
  createTime?: string
}

export const WmsInventoryH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsInventoryItem[]; total: number }>("/api/v1/app/wms/wms-inventory", { params })
  },
  async get(id: string) {
    return request.get<WmsInventoryItem>(`/api/v1/app/wms/wms-inventory/${id}`)
  },
}

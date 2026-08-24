// Auto-generated H5 Client SDK for 库存流水
import { request } from "@/shared/lib/request"

export interface WmsInventoryHistoryItem {
  id: string
  warehouse_id?: string
  item_id?: string
  change_type?: string
  qty_change?: number
  createTime?: string
}

export const WmsInventoryHistoryH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsInventoryHistoryItem[]; total: number }>("/api/v1/app/wms/wms-inventory-history", { params })
  },
  async get(id: string) {
    return request.get<WmsInventoryHistoryItem>(`/api/v1/app/wms/wms-inventory-history/${id}`)
  },
}

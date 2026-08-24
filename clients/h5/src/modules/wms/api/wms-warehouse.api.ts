// Auto-generated H5 Client SDK for 智能仓库
import { request } from "@/shared/lib/request"

export interface WmsWarehouseItem {
  id: string
  code?: string
  name?: string
  capacity?: number
  active?: boolean
  createTime?: string
}

export const WmsWarehouseH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsWarehouseItem[]; total: number }>("/api/v1/app/wms/wms-warehouse", { params })
  },
  async get(id: string) {
    return request.get<WmsWarehouseItem>(`/api/v1/app/wms/wms-warehouse/${id}`)
  },
}

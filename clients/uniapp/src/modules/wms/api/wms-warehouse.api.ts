// Auto-generated UniApp SDK for 智能仓库
import { request } from "@/shared/lib/request"

export interface WmsWarehouseItem {
  id: string
  code?: string
  name?: string
  capacity?: number
  active?: boolean
  createTime?: string
}

export function fetchWmsWarehouseList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsWarehouseItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-warehouse",
    method: "GET",
    data: params,
  })
}

// Auto-generated H5 Client SDK for 出库单
import { request } from "@/shared/lib/request"

export interface WmsShipmentOrderItem {
  id: string
  order_no?: string
  shipment_type?: string
  warehouse_id?: string
  merchant_id?: string
  createTime?: string
}

export const WmsShipmentOrderH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsShipmentOrderItem[]; total: number }>("/api/v1/app/wms/wms-shipment-order", { params })
  },
  async get(id: string) {
    return request.get<WmsShipmentOrderItem>(`/api/v1/app/wms/wms-shipment-order/${id}`)
  },
}

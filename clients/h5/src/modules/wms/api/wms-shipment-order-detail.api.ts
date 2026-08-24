// Auto-generated H5 Client SDK for 出库明细
import { request } from "@/shared/lib/request"

export interface WmsShipmentOrderDetailItem {
  id: string
  shipment_order_id?: string
  item_id?: string
  plan_qty?: number
  real_qty?: number
  createTime?: string
}

export const WmsShipmentOrderDetailH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsShipmentOrderDetailItem[]; total: number }>("/api/v1/app/wms/wms-shipment-order-detail", { params })
  },
  async get(id: string) {
    return request.get<WmsShipmentOrderDetailItem>(`/api/v1/app/wms/wms-shipment-order-detail/${id}`)
  },
}

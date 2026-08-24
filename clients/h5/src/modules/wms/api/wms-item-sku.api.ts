// Auto-generated H5 Client SDK for 物料SKU
import { request } from "@/shared/lib/request"

export interface WmsItemSkuItem {
  id: string
  item_id?: string
  sku_code?: string
  sku_name?: string
  barcode?: string
  createTime?: string
}

export const WmsItemSkuH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsItemSkuItem[]; total: number }>("/api/v1/app/wms/wms-item-sku", { params })
  },
  async get(id: string) {
    return request.get<WmsItemSkuItem>(`/api/v1/app/wms/wms-item-sku/${id}`)
  },
}

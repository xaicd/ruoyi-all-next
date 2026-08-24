// Auto-generated H5 Client SDK for 货主管理
import { request } from "@/shared/lib/request"

export interface WmsMerchantItem {
  id: string
  code?: string
  name?: string
  contact_name?: string
  contact_phone?: string
  createTime?: string
}

export const WmsMerchantH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: WmsMerchantItem[]; total: number }>("/api/v1/app/wms/wms-merchant", { params })
  },
  async get(id: string) {
    return request.get<WmsMerchantItem>(`/api/v1/app/wms/wms-merchant/${id}`)
  },
}

// Auto-generated UniApp SDK for 货主管理
import { request } from "@/shared/lib/request"

export interface WmsMerchantItem {
  id: string
  code?: string
  name?: string
  contact_name?: string
  contact_phone?: string
  createTime?: string
}

export function fetchWmsMerchantList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: WmsMerchantItem[]; total: number }>({
    url: "/api/v1/app/wms/wms-merchant",
    method: "GET",
    data: params,
  })
}

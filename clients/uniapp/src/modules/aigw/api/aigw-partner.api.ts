// Auto-generated UniApp SDK for 渠道代理商
import { request } from "@/shared/lib/request"

export interface AigwPartnerItem {
  id: string
  partner_code?: string
  name?: string
  level?: string
  registered_capital?: number
  createTime?: string
}

export function fetchAigwPartnerList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: AigwPartnerItem[]; total: number }>({
    url: "/api/v1/app/aigw/aigw-partner",
    method: "GET",
    data: params,
  })
}

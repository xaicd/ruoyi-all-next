// Auto-generated UniApp SDK for 商机报备与锁定
import { request } from "@/shared/lib/request"

export interface AigwPartnerLeadItem {
  id: string
  lead_no?: string
  partner_id?: string
  partner_name?: string
  customer_name?: string
  createTime?: string
}

export function fetchAigwPartnerLeadList(params?: { page?: number; pageSize?: number }) {
  return request<{ items: AigwPartnerLeadItem[]; total: number }>({
    url: "/api/v1/app/aigw/aigw-partner-lead",
    method: "GET",
    data: params,
  })
}

// Auto-generated H5 Client SDK for 商机报备与锁定
import { request } from "@/shared/lib/request"

export interface AigwPartnerLeadItem {
  id: string
  lead_no?: string
  partner_id?: string
  partner_name?: string
  customer_name?: string
  createTime?: string
}

export const AigwPartnerLeadH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: AigwPartnerLeadItem[]; total: number }>("/api/v1/app/aigw/aigw-partner-lead", { params })
  },
  async get(id: string) {
    return request.get<AigwPartnerLeadItem>(`/api/v1/app/aigw/aigw-partner-lead/${id}`)
  },
}

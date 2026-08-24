// Auto-generated H5 Client SDK for 渠道代理商
import { request } from "@/shared/lib/request"

export interface AigwPartnerItem {
  id: string
  partner_code?: string
  name?: string
  level?: string
  registered_capital?: number
  createTime?: string
}

export const AigwPartnerH5Api = {
  async list(params?: { page?: number; pageSize?: number; keyword?: string }) {
    return request.get<{ items: AigwPartnerItem[]; total: number }>("/api/v1/app/aigw/aigw-partner", { params })
  },
  async get(id: string) {
    return request.get<AigwPartnerItem>(`/api/v1/app/aigw/aigw-partner/${id}`)
  },
}

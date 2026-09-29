import { request } from "@/modules/shared/frontend/lib/request"

export interface EnterpriseItem {
  id: string
  name: string
  code: string
  creditCode?: string | null
  province?: string
  city?: string
  industry?: string
  contactName?: string | null
  contactPhone?: string | null
  status: "ACTIVE" | "DISABLED"
  createdAt?: string
  updatedAt?: string
}

export const AigwEnterpriseApi = {
  async page(params?: { page?: number; pageSize?: number; keyword?: string }): Promise<{ success: boolean; data: { items: EnterpriseItem[]; total: number } }> {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    if (params?.keyword) query.set("keyword", params.keyword)
    const res: any = await request.get(`/api/v1/admin/aigw/enterprises?${query.toString()}`)
    const payload = res?.data?.data || res?.data || res
    return {
      success: true,
      data: {
        items: payload?.items || [],
        total: payload?.total || 0,
      },
    }
  },

  async create(data: any) {
    return request.post("/api/v1/admin/aigw/enterprises", data)
  },

  async update(id: string, data: any) {
    return request.put(`/api/v1/admin/aigw/enterprises?id=${id}`, data)
  },

  async delete(id: string) {
    return request.delete(`/api/v1/admin/aigw/enterprises?id=${id}`)
  },
}

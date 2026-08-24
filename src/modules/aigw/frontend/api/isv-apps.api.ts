import { request } from "@/modules/shared/frontend/lib/request"

export interface IsvAppItem {
  id: string
  appCode: string
  name: string
  vendor: string
  category: "OFFICE" | "DEV" | "WORKFLOW" | "CUSTOM"
  momaModelTarget: string
  commissionRate: number
  authSecret: string
  activeSeatsCount: number
  status: "ACTIVE" | "DISABLED"
  icon: string
  description: string
  createdAt: string
}

export const AigwIsvAppApi = {
  async list(params?: { status?: string; keyword?: string }): Promise<{ items: IsvAppItem[]; total: number }> {
    const query = new URLSearchParams()
    if (params?.status) query.set("status", params.status)
    if (params?.keyword) query.set("keyword", params.keyword)
    const res: any = await request.get(`/api/v1/admin/aigw/isv-apps?${query.toString()}`)
    return res?.data || res
  },

  async create(data: Partial<IsvAppItem>): Promise<IsvAppItem> {
    const res: any = await request.post("/api/v1/admin/aigw/isv-apps", data)
    return res?.data || res
  },

  async update(id: string, data: Partial<IsvAppItem>): Promise<IsvAppItem> {
    const res: any = await request.put("/api/v1/admin/aigw/isv-apps", { id, ...data })
    return res?.data || res
  },

  async delete(id: string): Promise<boolean> {
    const res: any = await request.delete(`/api/v1/admin/aigw/isv-apps?id=${id}`)
    return res?.success || false
  },
}

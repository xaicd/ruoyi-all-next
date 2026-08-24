import { request } from "@/modules/shared/frontend/lib/request"

export interface MemberAllocationItem {
  id: string
  tenantId: string
  enterpriseId?: string
  enterpriseName?: string
  enterpriseCode?: string
  phone: string
  name: string
  deptName: string
  monthlyTokenCap: number
  usedTokens: number
  momaBeansBalance: number
  allowedApps: string[]
  status: "ACTIVE" | "DISABLED"
  lastLoginAt?: string
  createdAt: string
}

export const AigwTenantMemberApi = {
  async list(params?: { keyword?: string; status?: string; tenantId?: string; page?: number; pageSize?: number }): Promise<{ items: MemberAllocationItem[]; total: number }> {
    const query = new URLSearchParams()
    if (params?.keyword) query.set("keyword", params.keyword)
    if (params?.status) query.set("status", params.status)
    if (params?.tenantId) query.set("tenantId", params.tenantId)
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    const res: any = await request.get(`/api/v1/admin/aigw/tenant-members?${query.toString()}`)
    return res?.data || res
  },

  async create(data: Partial<MemberAllocationItem>): Promise<MemberAllocationItem> {
    const res: any = await request.post("/api/v1/admin/aigw/tenant-members", data)
    return res?.data || res
  },

  async update(id: string, data: Partial<MemberAllocationItem>): Promise<MemberAllocationItem> {
    const res: any = await request.put("/api/v1/admin/aigw/tenant-members", { id, ...data })
    return res?.data || res
  },

  async delete(id: string): Promise<boolean> {
    const res: any = await request.delete(`/api/v1/admin/aigw/tenant-members?id=${id}`)
    return res?.success || false
  },
}

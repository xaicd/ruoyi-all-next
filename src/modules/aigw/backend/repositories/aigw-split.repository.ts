import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export interface AigwSplitPipelineRow {
  id: string
  tenantId: string
  name: string
  channelCode: string
  partnerName: string
  carrierName?: string
  month?: string
  totalTokens?: string
  totalAmount?: string
  carrierShare?: string
  platformShare?: string
  commissionRateRatio: number
  totalRevenueAmount: number
  settledCommissionAmount: number
  status: "ACTIVE" | "SETTLED" | "UNSETTLED" | "DISABLED"
  createdAt: string
  updatedAt: string
}

export const MEMORY_PIPELINES: AigwSplitPipelineRow[] = [
  {
    id: "sp-1",
    tenantId: "1",
    name: "中国电信广东省分公司月度算力清分流水线",
    channelCode: "CT_GD_01",
    partnerName: "中国电信广东省分公司",
    carrierName: "中国电信广东省分公司",
    month: "2026-08",
    totalTokens: "3420",
    totalAmount: "0.0342",
    carrierShare: "0.0103",
    platformShare: "0.0239",
    commissionRateRatio: 0.3,
    totalRevenueAmount: 0.0342,
    settledCommissionAmount: 0.0103,
    status: "SETTLED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export class AigwSplitRepository {
  async findPage(tenantId: string, page = 1, pageSize = 20) {
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        const query = db.selectFrom("aigw_split_pipeline" as any).selectAll().where("tenant_id" as any, "=", tenantId)
        const totalResult = await query.select((eb: any) => eb.fn.count("id").as("total")).executeTakeFirst()
        const items = await query
          .offset((page - 1) * pageSize)
          .limit(pageSize)
          .orderBy("created_at" as any, "desc")
          .execute()
        return { items, total: Number(totalResult?.total || 0) }
      } catch (err) {
        console.warn("[aigw-split] DB fallback:", err)
      }
    }
    const filtered = MEMORY_PIPELINES.filter((item) => item.tenantId === tenantId)
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async create(tenantId: string, data: any): Promise<any> {
    const record: AigwSplitPipelineRow = {
      id: `sp-${Date.now()}`,
      tenantId,
      name: data.carrierName ? `${data.carrierName}清分流水线` : "三方清分流水线",
      channelCode: "CHANNEL_DEMO",
      partnerName: data.carrierName || "运营商代理",
      carrierName: data.carrierName || "运营商代理",
      month: data.month || "2026-08",
      totalTokens: data.totalTokens ? String(data.totalTokens) : "0",
      totalAmount: data.totalAmount ? String(data.totalAmount) : "0",
      carrierShare: data.carrierShare ? String(data.carrierShare) : "0",
      platformShare: data.platformShare ? String(data.platformShare) : "0",
      commissionRateRatio: 0.3,
      totalRevenueAmount: parseFloat(data.totalAmount || "0"),
      settledCommissionAmount: parseFloat(data.carrierShare || "0"),
      status: data.status || "SETTLED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MEMORY_PIPELINES.unshift(record)
    return record
  }

  async update(id: string, data: any) {
    const idx = MEMORY_PIPELINES.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_PIPELINES[idx] = {
        ...MEMORY_PIPELINES[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return MEMORY_PIPELINES[idx]
    }
    return null
  }

  async delete(id: string) {
    const idx = MEMORY_PIPELINES.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_PIPELINES.splice(idx, 1)
      return true
    }
    return false
  }
}

export const aigwSplitRepository = new AigwSplitRepository()

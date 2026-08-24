import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export interface AigwSplitPipelineRow {
  id: string
  tenantId: string
  name: string
  channelCode: string
  partnerName: string
  commissionRateRatio: number
  totalRevenueAmount: number
  settledCommissionAmount: number
  status: "ACTIVE" | "DISABLED"
  createdAt: string
  updatedAt: string
}

const MEMORY_PIPELINES: AigwSplitPipelineRow[] = [
  {
    id: "sp-1",
    tenantId: "1",
    name: "华南大区渠道算力分佣流水线",
    channelCode: "CHANNEL_HN_01",
    partnerName: "华南算力分销代理",
    commissionRateRatio: 0.12,
    totalRevenueAmount: 250000.0,
    settledCommissionAmount: 30000.0,
    status: "ACTIVE",
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
    const record = {
      id: `sp-${Date.now()}`,
      tenantId,
      name: data.carrierName || "三方清分",
      channelCode: "CHANNEL_DEMO",
      partnerName: data.carrierName || "运营商代理",
      commissionRateRatio: 0.3,
      totalRevenueAmount: parseFloat(data.totalAmount) || 0,
      settledCommissionAmount: parseFloat(data.carrierShare) || 0,
      status: data.status || "SETTLED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    }
    MEMORY_PIPELINES.unshift(record as any)
    return record
  }
}

export const aigwSplitRepository = new AigwSplitRepository()

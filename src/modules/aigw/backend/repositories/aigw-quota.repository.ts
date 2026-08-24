import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export interface AigwQuotaRow {
  id: string
  tenantId: string
  enterpriseId: string
  enterpriseName: string
  monthlyTokenCap: number
  usedTokenCount: number
  warnThresholdRatio: number
  autoThrottle: boolean
  status: "ACTIVE" | "DISABLED"
  createdAt: string
  updatedAt: string
}

const MEMORY_QUOTAS: AigwQuotaRow[] = [
  {
    id: "q-101",
    tenantId: "1",
    enterpriseId: "ent-1",
    enterpriseName: "智能智算科技（广州）有限公司",
    monthlyTokenCap: 500000000,
    usedTokenCount: 124500000,
    warnThresholdRatio: 80,
    autoThrottle: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "q-102",
    tenantId: "1",
    enterpriseId: "ent-2",
    enterpriseName: "量子算力数字工程研究院",
    monthlyTokenCap: 1000000000,
    usedTokenCount: 450000000,
    warnThresholdRatio: 85,
    autoThrottle: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export class AigwQuotaRepository {
  async findPage(tenantId: string, page = 1, pageSize = 20, enterpriseId?: string) {
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        let query = db.selectFrom("aigw_quota" as any).selectAll().where("tenant_id" as any, "=", tenantId)
        if (enterpriseId) {
          query = query.where("enterprise_id" as any, "=", enterpriseId)
        }
        const totalResult = await query.select((eb: any) => eb.fn.count("id").as("total")).executeTakeFirst()
        const items = await query
          .offset((page - 1) * pageSize)
          .limit(pageSize)
          .orderBy("created_at" as any, "desc")
          .execute()
        return { items, total: Number(totalResult?.total || 0) }
      } catch (err) {
        console.warn("[aigw-quota] DB fallback:", err)
      }
    }
    const filtered = MEMORY_QUOTAS.filter(
      (item) => item.tenantId === tenantId && (!enterpriseId || item.enterpriseId === enterpriseId)
    )
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }
}

export const aigwQuotaRepository = new AigwQuotaRepository()

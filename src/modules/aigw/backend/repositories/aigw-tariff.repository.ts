import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export interface AigwTariffRow {
  id: string
  tenantId: string
  name: string
  code: string
  modelGroup: string
  baseRatePerKTokens: number
  tier1ThresholdTokens: number
  tier1DiscountRate: number
  status: "ACTIVE" | "DISABLED"
  createdAt: string
  updatedAt: string
}

const MEMORY_TARIFFS: AigwTariffRow[] = [
  {
    id: "tar-1",
    tenantId: "1",
    name: "DeepSeek-V3 阶梯资费包",
    code: "TARIFF_DS_V3",
    modelGroup: "deepseek-v3",
    baseRatePerKTokens: 0.002,
    tier1ThresholdTokens: 100000000,
    tier1DiscountRate: 0.8,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tar-2",
    tenantId: "1",
    name: "Claude 3.5 Sonnet 企业算力资费",
    code: "TARIFF_CLAUDE_35",
    modelGroup: "claude-3-5-sonnet",
    baseRatePerKTokens: 0.015,
    tier1ThresholdTokens: 50000000,
    tier1DiscountRate: 0.85,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export class AigwTariffRepository {
  async findPage(tenantId: string, page = 1, pageSize = 20) {
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        const query = db.selectFrom("aigw_tariff" as any).selectAll().where("tenant_id" as any, "=", tenantId)
        const totalResult = await query.select((eb: any) => eb.fn.count("id").as("total")).executeTakeFirst()
        const items = await query
          .offset((page - 1) * pageSize)
          .limit(pageSize)
          .orderBy("created_at" as any, "desc")
          .execute()
        return { items, total: Number(totalResult?.total || 0) }
      } catch (err) {
        console.warn("[aigw-tariff] DB fallback:", err)
      }
    }
    const filtered = MEMORY_TARIFFS.filter((item) => item.tenantId === tenantId)
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }
}

export const aigwTariffRepository = new AigwTariffRepository()

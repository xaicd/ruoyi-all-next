import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export interface AigwContractRow {
  id: string
  tenantId: string
  contractNo: string
  title: string
  enterpriseId: string
  enterpriseName: string
  contractAmount: number
  settledAmount: number
  status: "ACTIVE" | "COMPLETED" | "TERMINATED"
  createdAt: string
  updatedAt: string
}

const MEMORY_CONTRACTS: AigwContractRow[] = [
  {
    id: "ct-1001",
    tenantId: "1",
    contractNo: "CT-2026-0801",
    title: "智能智算 2026 年度 AI 算力采购合同",
    enterpriseId: "ent-1",
    enterpriseName: "智能智算科技（广州）有限公司",
    contractAmount: 1200000.0,
    settledAmount: 300000.0,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export class AigwSettlementRepository {
  async findPage(tenantId: string, page = 1, pageSize = 20) {
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        const query = db.selectFrom("aigw_contract" as any).selectAll().where("tenant_id" as any, "=", tenantId)
        const totalResult = await query.select((eb: any) => eb.fn.count("id").as("total")).executeTakeFirst()
        const items = await query
          .offset((page - 1) * pageSize)
          .limit(pageSize)
          .orderBy("created_at" as any, "desc")
          .execute()
        return { items, total: Number(totalResult?.total || 0) }
      } catch (err) {
        console.warn("[aigw-settlement] DB fallback:", err)
      }
    }
    const filtered = MEMORY_CONTRACTS.filter((item) => item.tenantId === tenantId)
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }
}

export const aigwSettlementRepository = new AigwSettlementRepository()

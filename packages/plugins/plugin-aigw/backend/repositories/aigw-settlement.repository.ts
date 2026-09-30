import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export interface AigwContractRow {
  id: string
  tenantId: string
  contractNo: string
  title: string
  enterpriseId: string
  enterpriseName: string
  carrierName?: string
  grantedTokens?: number
  amount?: number
  contractAmount: number
  settledAmount: number
  status: "ACTIVE" | "COMPLETED" | "TERMINATED"
  createdAt: string
  updatedAt: string
}

export const MEMORY_CONTRACTS: AigwContractRow[] = [
  {
    id: "ct-1001",
    tenantId: "1",
    contractNo: "CT-2026-GD-0088",
    title: "中国电信广东省分公司 2026 算力框架采购标段",
    enterpriseId: "CT_GD_GOV",
    enterpriseName: "中国电信股份有限公司广东省政企分公司",
    carrierName: "中国电信广东省分公司",
    grantedTokens: 50000000,
    amount: 500000,
    contractAmount: 500000.0,
    settledAmount: 150000.0,
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

  async create(tenantId: string, data: any) {
    const record: AigwContractRow = {
      id: `ct-${Date.now()}`,
      tenantId,
      contractNo: data.contractNo || `CT-2026-${Math.floor(Math.random() * 8999 + 1000)}`,
      title: data.title || data.carrierName ? `${data.carrierName} 框架标段` : "招投标框架合同",
      enterpriseId: data.enterpriseId || "CT_GD_GOV",
      enterpriseName: data.enterpriseName || data.carrierName || "中国电信广东省分公司",
      carrierName: data.carrierName || "中国电信广东省分公司",
      grantedTokens: Number(data.grantedTokens || 50000000),
      amount: Number(data.amount || data.contractAmount || 500000),
      contractAmount: Number(data.contractAmount || data.amount || 500000),
      settledAmount: Number(data.settledAmount || 0),
      status: data.status || "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MEMORY_CONTRACTS.unshift(record)
    return record
  }

  async update(id: string, data: any) {
    const idx = MEMORY_CONTRACTS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_CONTRACTS[idx] = {
        ...MEMORY_CONTRACTS[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return MEMORY_CONTRACTS[idx]
    }
    return null
  }

  async delete(id: string) {
    const idx = MEMORY_CONTRACTS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_CONTRACTS.splice(idx, 1)
      return true
    }
    return false
  }
}

export const aigwSettlementRepository = new AigwSettlementRepository()

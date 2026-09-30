import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId, isTenantRequired, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"

function currentTenantId(explicit?: string): string | undefined {
  if (explicit) return explicit
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired() && !isPlatformContext()) throw new Error("资费数据访问缺少租户上下文")
  return undefined
}

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

export const MEMORY_TARIFFS: AigwTariffRow[] = []

export class AigwTariffRepository {
  async findPage(tenantId?: string, page = 1, pageSize = 20) {
    const activeTenantId = currentTenantId(tenantId)
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        let query = db.selectFrom("aigw_tariff" as any).selectAll()
        if (activeTenantId) query = query.where("tenant_id" as any, "=", activeTenantId)
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
    const filtered = MEMORY_TARIFFS.filter((item) => !activeTenantId || item.tenantId === activeTenantId)
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async create(dataOrTenant: any, maybeData?: any) {
    const activeTenantId = typeof dataOrTenant === "string" ? currentTenantId(dataOrTenant) : currentTenantId()
    const data = typeof dataOrTenant === "string" ? maybeData : dataOrTenant
    const record: AigwTariffRow = {
      id: `tar-${Date.now()}`,
      tenantId: activeTenantId || "1",
      name: data.name || "资费策略",
      code: data.code || `TARIFF_${Date.now()}`,
      modelGroup: data.modelPattern || data.modelGroup || "deepseek-v3",
      baseRatePerKTokens: Number(data.unitPrice || data.baseRatePerKTokens || 0.002),
      tier1ThresholdTokens: 50000000,
      tier1DiscountRate: Number(data.discountRatio || 0.5),
      status: data.status || "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MEMORY_TARIFFS.unshift(record)
    return record
  }

  async update(id: string, data: any) {
    const idx = MEMORY_TARIFFS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_TARIFFS[idx] = {
        ...MEMORY_TARIFFS[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return MEMORY_TARIFFS[idx]
    }
    return null
  }

  async delete(id: string) {
    const idx = MEMORY_TARIFFS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_TARIFFS.splice(idx, 1)
      return true
    }
    return false
  }
}

export const aigwTariffRepository = new AigwTariffRepository()

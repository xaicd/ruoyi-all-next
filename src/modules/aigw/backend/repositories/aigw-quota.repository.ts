import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId, isTenantRequired, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"

function currentTenantId(explicit?: string): string | undefined {
  if (explicit) return explicit
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired() && !isPlatformContext()) throw new Error("配额数据访问缺少租户上下文")
  return undefined
}

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

export const MEMORY_QUOTAS: AigwQuotaRow[] = []

export class AigwQuotaRepository {
  async findPage(tenantId?: string, page = 1, pageSize = 20, enterpriseId?: string) {
    const activeTenantId = currentTenantId(tenantId)
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        let query = db.selectFrom("aigw_quota" as any).selectAll()
        if (activeTenantId) query = query.where("tenant_id" as any, "=", activeTenantId)
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
      (item) => (!activeTenantId || item.tenantId === activeTenantId) && (!enterpriseId || item.enterpriseId === enterpriseId)
    )
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async create(dataOrTenant: any, maybeData?: any) {
    const activeTenantId = typeof dataOrTenant === "string" ? currentTenantId(dataOrTenant) : currentTenantId()
    const data = typeof dataOrTenant === "string" ? maybeData : dataOrTenant
    const record: AigwQuotaRow = {
      id: `q-${Date.now()}`,
      tenantId: activeTenantId || "1",
      enterpriseId: data.enterpriseId || `ent-${Date.now()}`,
      enterpriseName: data.enterpriseName || "未命名企业",
      monthlyTokenCap: Number(data.monthlyTokenCap || 50000000),
      usedTokenCount: Number(data.usedTokenCount || 0),
      warnThresholdRatio: Number(data.warnThresholdRatio || 80),
      autoThrottle: Boolean(data.autoThrottle ?? true),
      status: data.status || "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    MEMORY_QUOTAS.unshift(record)
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        await db.insertInto("aigw_quota" as any).values(record as any).execute()
      } catch (err) {
        console.warn("[aigw-quota] DB create fallback:", err)
      }
    }
    return record
  }

  async update(id: string, data: any) {
    const idx = MEMORY_QUOTAS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_QUOTAS[idx] = {
        ...MEMORY_QUOTAS[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return MEMORY_QUOTAS[idx]
    }
    return null
  }

  async delete(id: string) {
    const idx = MEMORY_QUOTAS.findIndex((item) => item.id === id)
    if (idx !== -1) {
      MEMORY_QUOTAS.splice(idx, 1)
      return true
    }
    return false
  }
}

export const aigwQuotaRepository = new AigwQuotaRepository()

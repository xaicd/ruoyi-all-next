import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export interface AigwEnterpriseRow {
  id: string
  tenantId: string
  name: string
  code: string
  creditCode?: string | null
  province: string
  city: string
  industry: string
  contactName?: string | null
  contactPhone?: string | null
  status: "ACTIVE" | "DISABLED"
  createdAt: string
  updatedAt: string
}

export const SEED_ENTERPRISES: AigwEnterpriseRow[] = [
  {
    id: "ent-001",
    tenantId: "1",
    name: "广东省政务服务和数据管理局",
    code: "gd-gov-data",
    creditCode: "11440000MB2D00001X",
    province: "广东省",
    city: "广州市",
    industry: "政务服务/信息化",
    contactName: "李总",
    contactPhone: "13800000001",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ent-002",
    tenantId: "1",
    name: "广州市数字政府运营中心",
    code: "gz-digital-gov",
    creditCode: "11440100MB2D00002Y",
    province: "广东省",
    city: "广州市",
    industry: "数字政府/协同办公",
    contactName: "王主任",
    contactPhone: "13766668888",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ent-003",
    tenantId: "1",
    name: "广东省交通数智科技集团有限公司",
    code: "yue-transport-tech",
    creditCode: "91440000MA5D00003Z",
    province: "广东省",
    city: "广州市",
    industry: "国企研发/数智交通",
    contactName: "张工",
    contactPhone: "13911112222",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ent-004",
    tenantId: "1",
    name: "深圳市住房公积金管理中心",
    code: "sz-housing-fund",
    creditCode: "11440300MB2D00004W",
    province: "广东省",
    city: "深圳市",
    industry: "智慧政务/民生服务",
    contactName: "陈科长",
    contactPhone: "13600009999",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "ent-005",
    tenantId: "1",
    name: "中国移动通信集团广东有限公司",
    code: "chinamobile-gd",
    creditCode: "91440000707663242B",
    province: "广东省",
    city: "广州市",
    industry: "电信/运营商",
    contactName: "林经理",
    contactPhone: "13588886666",
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]

export const MEMORY_ENTERPRISES: AigwEnterpriseRow[] = [...SEED_ENTERPRISES]

import { getCurrentTenantId, isTenantRequired, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"

function currentTenantId(explicit?: string): string | undefined {
  if (explicit) return explicit
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired() && !isPlatformContext()) throw new Error("政企数据访问缺少租户上下文")
  return undefined
}

export class AigwEnterpriseRepository {
  async findPage(tenantId?: string, page = 1, pageSize = 20, keyword?: string) {
    const activeTenantId = currentTenantId(tenantId)
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        let query = db.selectFrom("aigw_enterprise" as any).selectAll()
        if (activeTenantId) query = query.where("tenant_id" as any, "=", activeTenantId)
        if (keyword) {
          query = query.where((eb: any) =>
            eb.or([
              eb("name", "like", `%${keyword}%`),
              eb("code", "like", `%${keyword}%`),
            ])
          )
        }
        const totalResult = await query.select((eb: any) => eb.fn.count("id").as("total")).executeTakeFirst()
        const items = await query
          .offset((page - 1) * pageSize)
          .limit(pageSize)
          .orderBy("created_at" as any, "desc")
          .execute()
        return { items, total: Number(totalResult?.total || 0) }
      } catch (err) {
        console.warn("[aigw-enterprise] DB fallback to memory:", err)
      }
    }
    const filtered = MEMORY_ENTERPRISES.filter(
      (item) => (!activeTenantId || item.tenantId === activeTenantId) && (!keyword || item.name.includes(keyword) || item.code.includes(keyword))
    )
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async findById(tenantIdOrId: string, id?: string): Promise<AigwEnterpriseRow | null> {
    const targetId = id || tenantIdOrId
    const activeTenantId = id ? currentTenantId(tenantIdOrId) : currentTenantId()
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        let query = db.selectFrom("aigw_enterprise" as any).selectAll().where("id" as any, "=", targetId)
        if (activeTenantId) query = query.where("tenant_id" as any, "=", activeTenantId)
        const row = await query.executeTakeFirst()
        if (row) return row as any
      } catch (err) {
        console.warn("[aigw-enterprise] DB findById fallback:", err)
      }
    }
    return MEMORY_ENTERPRISES.find((e) => (!activeTenantId || e.tenantId === activeTenantId) && e.id === targetId) || null
  }

  async create(dataOrTenant: any, maybeData?: any): Promise<AigwEnterpriseRow> {
    const activeTenantId = typeof dataOrTenant === "string" ? currentTenantId(dataOrTenant) : currentTenantId()
    const data = typeof dataOrTenant === "string" ? maybeData : dataOrTenant
    const now = new Date().toISOString()
    const record: AigwEnterpriseRow = {
      id: `ent-${Date.now()}`,
      tenantId: activeTenantId || "1",
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        await db.insertInto("aigw_enterprise" as any).values(record as any).execute()
      } catch (err) {
        console.warn("[aigw-enterprise] DB create fallback:", err)
      }
    }
    MEMORY_ENTERPRISES.unshift(record)
    return record
  }
}

export const AigwEnterpriseRepositorySingleton = new AigwEnterpriseRepository()
export const aigwEnterpriseRepository = AigwEnterpriseRepositorySingleton
export { AigwEnterpriseRepositorySingleton as AigwEnterpriseRepo }

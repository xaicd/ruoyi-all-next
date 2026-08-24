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

export const MEMORY_ENTERPRISES: AigwEnterpriseRow[] = []

export class AigwEnterpriseRepository {
  async findPage(tenantId: string, page = 1, pageSize = 20, keyword?: string) {
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        let query = db.selectFrom("aigw_enterprise" as any).selectAll().where("tenant_id" as any, "=", tenantId)
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
      (item) => item.tenantId === tenantId && (!keyword || item.name.includes(keyword) || item.code.includes(keyword))
    )
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async findById(tenantId: string, id: string): Promise<AigwEnterpriseRow | null> {
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        const row = await db.selectFrom("aigw_enterprise" as any).selectAll().where("tenant_id" as any, "=", tenantId).where("id" as any, "=", id).executeTakeFirst()
        if (row) return row as any
      } catch (err) {
        console.warn("[aigw-enterprise] DB findById fallback:", err)
      }
    }
    return MEMORY_ENTERPRISES.find((e) => e.tenantId === tenantId && e.id === id) || null
  }

  async create(tenantId: string, data: Omit<AigwEnterpriseRow, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<AigwEnterpriseRow> {
    const now = new Date().toISOString()
    const record: AigwEnterpriseRow = {
      id: `ent-${Date.now()}`,
      tenantId,
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

export const aigwEnterpriseRepository = new AigwEnterpriseRepository()

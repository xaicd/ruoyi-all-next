import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export interface AigwSeatRow {
  id: string
  tenantId: string
  enterpriseId: string
  userId?: string | null
  userName: string
  userEmail?: string | null
  appType: "WORKBUDDY" | "QODER" | "TRAE" | string
  vendorSeatId?: string | null
  monthlyTokenCap: number
  usedTokenCount: number
  status: "ACTIVE" | "DISABLED"
  createdAt: string
  updatedAt: string
}

export const MEMORY_SEATS: AigwSeatRow[] = []

export class AigwSeatRepository {
  async findPage(tenantId: string, page = 1, pageSize = 20, enterpriseId?: string) {
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        let query = db.selectFrom("aigw_seat" as any).selectAll().where("tenant_id" as any, "=", tenantId)
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
        console.warn("[aigw-seat] DB fallback to memory:", err)
      }
    }
    const filtered = MEMORY_SEATS.filter(
      (item) => item.tenantId === tenantId && (!enterpriseId || item.enterpriseId === enterpriseId)
    )
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }

  async create(tenantId: string, data: Omit<AigwSeatRow, "id" | "tenantId" | "usedTokenCount" | "createdAt" | "updatedAt">): Promise<AigwSeatRow> {
    const now = new Date().toISOString()
    const record: AigwSeatRow = {
      id: `seat-${Date.now()}`,
      tenantId,
      ...data,
      usedTokenCount: 0,
      createdAt: now,
      updatedAt: now,
    }
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        await db.insertInto("aigw_seat" as any).values(record as any).execute()
      } catch (err) {
        console.warn("[aigw-seat] DB create fallback:", err)
      }
    }
    MEMORY_SEATS.unshift(record)
    return record
  }
}

export const aigwSeatRepository = new AigwSeatRepository()

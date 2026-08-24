import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"

export interface AigwCarrierAgentRecord {
  id: string
  carrierCode: string
  carrierName: string
  province: string
  revenueShareRatio: number
  contactName: string | null
  contactPhone: string | null
  status: "ACTIVE" | "DISABLED"
  createdAt: string
  updatedAt: string
}

const MEMORY_CARRIER_STORE: AigwCarrierAgentRecord[] = [
  {
    id: "carrier-001",
    carrierCode: "CHINA_TELECOM",
    carrierName: "中国电信 - 广东省政企 AI 业务部",
    province: "广东省",
    revenueShareRatio: 30.0,
    contactName: "张经理",
    contactPhone: "13800138000",
    status: "ACTIVE",
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
  {
    id: "carrier-002",
    carrierCode: "CHINA_MOBILE",
    carrierName: "中国移动 - 浙江省云算力中心",
    province: "浙江省",
    revenueShareRatio: 35.0,
    contactName: "李总",
    contactPhone: "13900139000",
    status: "ACTIVE",
    createdAt: "2026-08-24T00:00:00.000Z",
    updatedAt: "2026-08-24T00:00:00.000Z",
  },
]

export class AigwCarrierRepository {
  async page(page = 1, pageSize = 20): Promise<{ items: AigwCarrierAgentRecord[]; total: number }> {
    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        const offset = (page - 1) * pageSize
        const rows = await db
          .selectFrom("aigw_carrier_agent" as any)
          .selectAll()
          .where("deleted", "=", false)
          .orderBy("created_at", "desc")
          .offset(offset)
          .limit(pageSize)
          .execute()

        const totalRes = await db
          .selectFrom("aigw_carrier_agent" as any)
          .select((eb: any) => eb.fn.count("id").as("cnt"))
          .where("deleted", "=", false)
          .executeTakeFirst()

        return {
          items: rows.map((r: any) => ({
            id: r.id,
            carrierCode: r.carrier_code,
            carrierName: r.carrier_name,
            province: r.province,
            revenueShareRatio: Number(r.revenue_share_ratio),
            contactName: r.contact_name,
            contactPhone: r.contact_phone,
            status: r.status as "ACTIVE" | "DISABLED",
            createdAt: new Date(r.created_at).toISOString(),
            updatedAt: new Date(r.updated_at).toISOString(),
          })),
          total: Number((totalRes as any)?.cnt ?? 0),
        }
      } catch (err) {
        console.warn("[AigwCarrierRepository] Fallback to memory query:", err)
      }
    }

    const items = MEMORY_CARRIER_STORE.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: MEMORY_CARRIER_STORE.length }
  }

  async create(input: {
    carrierCode: string
    carrierName: string
    province: string
    revenueShareRatio?: number
    contactName?: string
    contactPhone?: string
  }): Promise<AigwCarrierAgentRecord> {
    const record: AigwCarrierAgentRecord = {
      id: randomUUID(),
      carrierCode: input.carrierCode,
      carrierName: input.carrierName,
      province: input.province,
      revenueShareRatio: input.revenueShareRatio ?? 30.0,
      contactName: input.contactName ?? null,
      contactPhone: input.contactPhone ?? null,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        await db
          .insertInto("aigw_carrier_agent" as any)
          .values({
            id: record.id,
            carrier_code: record.carrierCode,
            carrier_name: record.carrierName,
            province: record.province,
            revenue_share_ratio: record.revenueShareRatio,
            contact_name: record.contactName,
            contact_phone: record.contactPhone,
            status: record.status,
            created_at: new Date(record.createdAt),
            updated_at: new Date(record.updatedAt),
            deleted: false,
          })
          .execute()
        return record
      } catch (err) {
        console.warn("[AigwCarrierRepository] Fallback to memory create:", err)
      }
    }

    MEMORY_CARRIER_STORE.unshift(record)
    return record
  }
}

export const aigwCarrierRepository = new AigwCarrierRepository()

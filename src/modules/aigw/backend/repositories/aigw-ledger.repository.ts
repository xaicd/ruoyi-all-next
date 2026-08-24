import { randomUUID } from "node:crypto"
import { getKyselyDb, hasRealDatabase } from "@/modules/shared/backend/lib/database"

export interface AigwQuotaLedgerRecord {
  id: string
  tenantId: string
  changeType: "PACKAGE_REFRESH" | "SKU_RECHARGE" | "USAGE_DEDUCT" | "ADMIN_ADJUST" | "CONTRACT_FRAMEWORK_GRANT"
  deltaTokens: number
  balanceAfter: number
  modelPattern: string
  refId: string | null
  operatorId: string | null
  remark: string | null
  createdAt: string
}

const MEMORY_LEDGER_STORE: AigwQuotaLedgerRecord[] = [
  {
    id: "ledger-001",
    tenantId: "1",
    changeType: "CONTRACT_FRAMEWORK_GRANT",
    deltaTokens: 500000000,
    balanceAfter: 500000000,
    modelPattern: "*",
    refId: "CT-2026-GD-0088",
    operatorId: "admin",
    remark: "中国电信广东分公司 5亿 Token 框架招投标开户划拨",
    createdAt: "2026-08-24T00:00:00.000Z",
  },
]

export class AigwQuotaLedgerRepository {
  private hasRealDatabase(): boolean {
    return Boolean(process.env.DATABASE_URL)
  }

  async recordChange(input: {
    tenantId: string
    changeType: AigwQuotaLedgerRecord["changeType"]
    deltaTokens: number
    balanceAfter: number
    modelPattern?: string
    refId?: string
    operatorId?: string
    remark?: string
  }): Promise<AigwQuotaLedgerRecord> {
    const record: AigwQuotaLedgerRecord = {
      id: randomUUID(),
      tenantId: input.tenantId,
      changeType: input.changeType,
      deltaTokens: input.deltaTokens,
      balanceAfter: input.balanceAfter,
      modelPattern: input.modelPattern ?? "*",
      refId: input.refId ?? null,
      operatorId: input.operatorId ?? null,
      remark: input.remark ?? null,
      createdAt: new Date().toISOString(),
    }

    if (this.hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        await db
          .insertInto("aigw_tenant_quota_ledger" as any)
          .values({
            id: record.id,
            tenant_id: record.tenantId,
            change_type: record.changeType,
            delta_tokens: record.deltaTokens,
            balance_after: record.balanceAfter,
            model_pattern: record.modelPattern,
            ref_id: record.refId,
            operator_id: record.operatorId,
            remark: record.remark,
            created_at: new Date(record.createdAt),
          })
          .execute()
        return record
      } catch (err) {
        console.warn("[AigwQuotaLedgerRepository] Fallback to memory insert:", err)
      }
    }

    MEMORY_LEDGER_STORE.unshift(record)
    return record
  }

  async queryHistory(tenantId: string, page = 1, pageSize = 20): Promise<{ items: AigwQuotaLedgerRecord[]; total: number }> {
    if (this.hasRealDatabase()) {
      try {
        const db = await getKyselyDb()
        const offset = (page - 1) * pageSize
        const rows = await db
          .selectFrom("aigw_tenant_quota_ledger" as any)
          .selectAll()
          .where("tenant_id", "=", tenantId)
          .orderBy("created_at", "desc")
          .offset(offset)
          .limit(pageSize)
          .execute()

        const totalRes = await db
          .selectFrom("aigw_tenant_quota_ledger" as any)
          .select((eb: any) => eb.fn.count("id").as("cnt"))
          .where("tenant_id", "=", tenantId)
          .executeTakeFirst()

        return {
          items: rows.map((r: any) => ({
            id: r.id,
            tenantId: r.tenant_id,
            changeType: r.change_type as AigwQuotaLedgerRecord["changeType"],
            deltaTokens: Number(r.delta_tokens),
            balanceAfter: Number(r.balance_after),
            modelPattern: r.model_pattern ?? "*",
            refId: r.ref_id,
            operatorId: r.operator_id,
            remark: r.remark,
            createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
          })),
          total: Number(totalRes?.cnt ?? 0),
        }
      } catch (err) {
        console.warn("[AigwQuotaLedgerRepository] Fallback to memory query:", err)
      }
    }

    const filtered = MEMORY_LEDGER_STORE.filter((r) => r.tenantId === tenantId)
    const items = filtered.slice((page - 1) * pageSize, page * pageSize)
    return { items, total: filtered.length }
  }
}

export const aigwQuotaLedgerRepository = new AigwQuotaLedgerRepository()

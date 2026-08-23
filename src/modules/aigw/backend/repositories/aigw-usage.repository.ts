import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"

export type AigwUsageRow = {
  id: string
  tokenId?: string | null
  channelId?: string | null
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  success: boolean
  latencyMs: number
  error?: string | null
  tenantId?: string | null
  createdAt: string
}

const MEMORY_STORE: AigwUsageRow[] = []
let memorySeq = 100

export const AigwUsageRepository = {
  async findAll(params?: { model?: string; limit?: number }): Promise<AigwUsageRow[]> {
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db.selectFrom("ai_usage" as any).selectAll()
      if (params?.model) query = query.where("model" as any, "=", params.model)
      const rows = await query.orderBy("created_at" as any, "desc").limit(params?.limit ?? 50).execute()
      return rows.map((r: any) => ({
        ...r,
        tokenId: r.token_id,
        channelId: r.channel_id,
        promptTokens: r.prompt_tokens,
        completionTokens: r.completion_tokens,
        totalTokens: r.total_tokens,
        latencyMs: r.latency_ms,
      }))
    }

    let list = [...MEMORY_STORE]
    if (params?.model) list = list.filter((r) => r.model === params.model)
    return list.slice(0, params?.limit ?? 50)
  },

  async record(data: Omit<AigwUsageRow, "id" | "createdAt">): Promise<AigwUsageRow> {
    const now = new Date().toISOString()
    const id = `usg-${Date.now().toString(36)}-${(++memorySeq).toString(36)}`
    const row: AigwUsageRow = {
      ...data,
      id,
      createdAt: now,
    }

    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      await db.insertInto("ai_usage" as any).values({
        id,
        token_id: data.tokenId ?? null,
        channel_id: data.channelId ?? null,
        model: data.model,
        prompt_tokens: data.promptTokens,
        completion_tokens: data.completionTokens,
        total_tokens: data.totalTokens,
        success: data.success,
        latency_ms: data.latencyMs,
        error: data.error ?? null,
        tenant_id: data.tenantId ?? "1",
        created_at: now,
      }).execute()
    } else {
      MEMORY_STORE.unshift(row)
    }
    return row
  },
}

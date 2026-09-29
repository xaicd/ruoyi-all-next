import { hasRealDatabase, getKyselyDb } from "@/modules/shared/backend/lib/database"
import { getCurrentTenantId, isTenantRequired, isPlatformContext } from "@/modules/shared/backend/lib/biz-tenant"

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

/**
 * 租户唯一来源 = 全局上下文（withAdminRoute 自动注入，AGENTS.md §4.8）。
 * 查询侧禁止依赖调用方显式传 tenantId；无上下文且 required 模式直接抛错。
 */
function currentTenantId(): string | undefined {
  const tenantId = getCurrentTenantId()
  if (tenantId) return tenantId
  if (isTenantRequired() && !isPlatformContext()) throw new Error("用量数据访问缺少租户上下文")
  return undefined
}

export const AigwUsageRepository = {
  async findAll(params?: { model?: string; limit?: number }): Promise<AigwUsageRow[]> {
    const tenantId = currentTenantId()
    if (hasRealDatabase()) {
      const db = await getKyselyDb()
      let query = db.selectFrom("ai_usage" as any).selectAll()
      if (tenantId) query = query.where("tenant_id" as any, "=", tenantId)
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
        tenantId: r.tenant_id,
      }))
    }

    let list = [...MEMORY_STORE]
    if (tenantId) list = list.filter((r) => !r.tenantId || r.tenantId === tenantId)
    if (params?.model) list = list.filter((r) => r.model === params.model)
    return list.slice(0, params?.limit ?? 50)
  },

  async record(data: Omit<AigwUsageRow, "id" | "createdAt">): Promise<AigwUsageRow> {
    const now = new Date().toISOString()
    const id = `usg-${Date.now().toString(36)}-${(++memorySeq).toString(36)}`
    // 租户优先级：已验证资源归属（如 relay 的 token.tenantId）→ 全局上下文；required 模式兜底抛错
    const tenantId = data.tenantId ?? currentTenantId()
    if (isTenantRequired() && !tenantId) throw new Error("用量记录缺少租户上下文")
    const row: AigwUsageRow = {
      ...data,
      id,
      tenantId: tenantId ?? null,
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
        tenant_id: tenantId ?? null,
        created_at: now,
      }).execute()
    } else {
      MEMORY_STORE.unshift(row)
    }
    return row
  },
}

export const aigwUsageRepository = AigwUsageRepository


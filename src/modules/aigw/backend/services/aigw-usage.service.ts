import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { AigwUsageRepository, type AigwUsageRow } from "@/modules/aigw/backend/repositories/aigw-usage.repository"
import { AigwAccessTokenRepository } from "@/modules/aigw/backend/repositories/aigw-access-token.repository"
import { aigwStore, maskSecret } from "./aigw.store"

export class AigwUsageService {
  static async page(input: { page?: number; pageSize?: number; keyword?: string; tenantId?: string | null }) {
    const page = input.page ?? 1
    const pageSize = input.pageSize ?? 20
    const rows = await AigwUsageRepository.findAll({ model: input.keyword, limit: 100, tenantId: input.tenantId })
    const start = (page - 1) * pageSize
    const pageRows = rows.slice(start, start + pageSize)
    
    // 高性能准则：绝不全表扫描 Token，仅从当前页数据中去重提取 Token ID，执行精准主键 IN 查询
    const targetTokenIds = Array.from(new Set(pageRows.map((r) => r.tokenId).filter(Boolean))) as string[]
    const tokens = targetTokenIds.length > 0 ? await AigwAccessTokenRepository.findByIds(targetTokenIds) : []
    const tokenMap = new Map(tokens.map((t) => [t.id, t]))

    const items = pageRows.map((r) => {
      const token = r.tokenId ? tokenMap.get(r.tokenId) : null
      return {
        ...r,
        tokenName: token?.name ?? (r.tokenId ? `令牌 (${r.tokenId.slice(0, 8)})` : "-"),
        tokenKey: token ? maskSecret(token.key) : "-",
      }
    })
    return {
      items,
      total: rows.length,
      page,
      pageSize,
    }
  }


  static async record(input: Omit<AigwUsageRow, "id" | "createdAt">) {
    const row = await AigwUsageRepository.record(input)
    aigwStore.usages.push({
      id: row.id,
      tokenId: row.tokenId ?? "",
      channelId: row.channelId ?? "",
      model: row.model,
      promptTokens: row.promptTokens,
      completionTokens: row.completionTokens,
      success: row.success,
      latencyMs: row.latencyMs,
      error: row.error ?? undefined,
      tenantId: row.tenantId ?? undefined,
      createdAt: row.createdAt,
    })
    domainLog.event("aigw.usage.record", { id: row.id, model: row.model, success: row.success })
    return row
  }
}

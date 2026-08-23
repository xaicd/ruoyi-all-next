import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { AigwUsageRepository, type AigwUsageRow } from "@/modules/aigw/backend/repositories/aigw-usage.repository"
import { aigwStore } from "./aigw.store"

export class AigwUsageService {
  static async page(input: { page?: number; pageSize?: number; keyword?: string }) {
    const page = input.page ?? 1
    const pageSize = input.pageSize ?? 20
    const rows = await AigwUsageRepository.findAll({ model: input.keyword, limit: 100 })
    const start = (page - 1) * pageSize
    return {
      items: rows.slice(start, start + pageSize),
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
      createdAt: row.createdAt,
    })
    domainLog.event("aigw.usage.record", { id: row.id, model: row.model, success: row.success })
    return row
  }
}

import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { aiGatewayStore, type AiUsageRecord } from "./ai-gateway.store"

export class AiUsageService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    let rows = [...aiGatewayStore.usages].reverse()
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      rows = rows.filter((item) => item.model.toLowerCase().includes(kw) || item.channelId.includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    return {
      items: rows.slice(start, start + input.pageSize),
      total: rows.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static record(input: Omit<AiUsageRecord, "id" | "createdAt">) {
    const row: AiUsageRecord = {
      ...input,
      id: aiGatewayStore.nextUsageId(),
      createdAt: new Date().toISOString(),
    }
    aiGatewayStore.usages.push(row)
    domainLog.event("ai.usage.record", { id: row.id, model: row.model, success: row.success })
    return row
  }
}

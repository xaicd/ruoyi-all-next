import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { aiGatewayStore, maskSecret, type AiChannelRecord, type AiProvider } from "./ai-gateway.store"

export type AiChannelWriteInput = {
  name: string
  provider: AiProvider
  baseUrl?: string
  apiKey?: string
  models: string[]
  modelMap?: Record<string, string>
  weight?: number
  priority?: number
  autoDisable?: boolean
}

export class AiChannelService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    let rows = [...aiGatewayStore.channels]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      rows = rows.filter((item) => item.name.toLowerCase().includes(kw) || item.provider.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("ai.channel.page", { page: input.page, total: rows.length })
    return {
      items: rows.slice(start, start + input.pageSize).map(toPublic),
      total: rows.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async create(input: AiChannelWriteInput) {
    if (aiGatewayStore.channels.some((item) => item.name === input.name)) throw new Error("渠道名称已存在")
    const record: AiChannelRecord = {
      id: aiGatewayStore.nextChannelId(),
      name: input.name,
      provider: input.provider,
      baseUrl: input.baseUrl ?? "",
      apiKey: input.apiKey ?? "",
      models: input.models,
      modelMap: input.modelMap ?? {},
      weight: input.weight ?? 100,
      priority: input.priority ?? 1,
      status: "ACTIVE",
      autoDisable: input.autoDisable ?? true,
      failCount: 0,
      protocol: "openai",
      createdAt: new Date().toISOString(),
    }
    aiGatewayStore.channels.push(record)
    domainLog.audit("ai.channel.create", { targetType: "AI_CHANNEL", targetId: record.id })
    return { id: record.id }
  }

  static async update(input: Partial<AiChannelWriteInput> & { id: string; status?: "ACTIVE" | "DISABLED" }) {
    const record = aiGatewayStore.channels.find((item) => item.id === input.id)
    if (!record) throw new Error("渠道不存在")
    if (input.status) assertChannelStatus(record.status, input.status)
    if (input.name) record.name = input.name
    if (input.provider) record.provider = input.provider
    if (input.baseUrl !== undefined) record.baseUrl = input.baseUrl
    if (input.apiKey !== undefined) record.apiKey = input.apiKey
    if (input.models) record.models = input.models
    if (input.modelMap) record.modelMap = input.modelMap
    if (input.weight !== undefined) record.weight = input.weight
    if (input.priority !== undefined) record.priority = input.priority
    if (input.autoDisable !== undefined) record.autoDisable = input.autoDisable
    const fromStatus = record.status
    if (input.status) record.status = input.status
    domainLog.audit("ai.channel.update", {
      targetType: "AI_CHANNEL",
      targetId: record.id,
      fromStatus,
      toStatus: record.status,
    })
    return true
  }

  static async delete(id: string) {
    const index = aiGatewayStore.channels.findIndex((item) => item.id === id)
    if (index === -1) throw new Error("渠道不存在")
    aiGatewayStore.channels.splice(index, 1)
    domainLog.audit("ai.channel.delete", { targetType: "AI_CHANNEL", targetId: id })
    return true
  }

  static pick(model: string): AiChannelRecord[] {
    return aiGatewayStore.channels
      .filter((item) => item.status === "ACTIVE" && item.models.includes(model))
      .sort((a, b) => b.priority - a.priority || b.weight - a.weight)
  }

  static listActiveModels(): string[] {
    const names = new Set<string>()
    for (const channel of aiGatewayStore.channels) {
      if (channel.status !== "ACTIVE") continue
      for (const model of channel.models) names.add(model)
    }
    return [...names]
  }

  static markFail(id: string) {
    const record = aiGatewayStore.channels.find((item) => item.id === id)
    if (!record) return
    record.failCount += 1
    if (record.autoDisable && record.failCount >= 3) record.status = "DISABLED"
  }

  static markOk(id: string) {
    const record = aiGatewayStore.channels.find((item) => item.id === id)
    if (!record) return
    record.failCount = 0
  }
}

function assertChannelStatus(from: AiChannelRecord["status"], to: AiChannelRecord["status"]) {
  if (from === to) return
  const allowed = new Set(["ACTIVE->DISABLED", "DISABLED->ACTIVE"])
  if (!allowed.has(`${from}->${to}`)) {
    throw Object.assign(new Error(`渠道状态不可从 ${from} 迁到 ${to}`), { status: 409 })
  }
}

function toPublic(record: AiChannelRecord) {
  return { ...record, apiKey: maskSecret(record.apiKey) }
}

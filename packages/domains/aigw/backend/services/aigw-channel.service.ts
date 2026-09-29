import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { AigwChannelRepository, type AigwChannelRow } from "@/modules/aigw/backend/repositories/aigw-channel.repository"
import { aigwStore, maskSecret, type AigwChannelRecord, type AigwProvider } from "./aigw.store"

export type AigwChannelWriteInput = {
  name: string
  provider: AigwProvider
  baseUrl?: string
  apiKey?: string
  models: string[]
  modelMap?: Record<string, string>
  weight?: number
  priority?: number
  autoDisable?: boolean
}

export class AigwChannelService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    const rows = await AigwChannelRepository.findAll({ keyword: input.keyword })
    const start = (input.page - 1) * input.pageSize
    domainLog.event("aigw.channel.page", { page: input.page, total: rows.length })
    return {
      items: rows.slice(start, start + input.pageSize).map(toPublic),
      total: rows.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async create(input: AigwChannelWriteInput) {
    const all = await AigwChannelRepository.findAll()
    if (all.some((item) => item.name === input.name)) throw new Error("渠道名称已存在")
    const record = await AigwChannelRepository.create({
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
    })
    aigwStore.channels.push({
      id: record.id,
      name: record.name,
      provider: record.provider as AigwProvider,
      baseUrl: record.baseUrl,
      apiKey: record.apiKey,
      models: record.models,
      modelMap: record.modelMap,
      weight: record.weight,
      priority: record.priority,
      status: record.status,
      autoDisable: record.autoDisable,
      failCount: record.failCount,
      protocol: record.protocol,
      createdAt: record.createdAt,
    })
    domainLog.audit("aigw.channel.create", { targetType: "AIGW_CHANNEL", targetId: record.id })
    return { id: record.id }
  }

  static async update(input: Partial<AigwChannelWriteInput> & { id: string; status?: "ACTIVE" | "DISABLED" }) {
    const record = await AigwChannelRepository.findById(input.id)
    if (!record) throw new Error("渠道不存在")
    if (input.status) assertChannelStatus(record.status, input.status)
    const fromStatus = record.status
    const updated = await AigwChannelRepository.update(input.id, input as any)
    const storeCh = aigwStore.channels.find((c) => c.id === input.id)
    if (storeCh) {
      if (input.status) storeCh.status = input.status
      if (input.name) storeCh.name = input.name
    }
    domainLog.audit("aigw.channel.update", {
      targetType: "AIGW_CHANNEL",
      targetId: record.id,
      fromStatus,
      toStatus: updated.status,
    })
    return true
  }

  static async delete(id: string) {
    await AigwChannelRepository.delete(id)
    const idx = aigwStore.channels.findIndex((c) => c.id === id)
    if (idx !== -1) aigwStore.channels.splice(idx, 1)
    domainLog.audit("aigw.channel.delete", { targetType: "AIGW_CHANNEL", targetId: id })
    return true
  }

  static pick(model: string): AigwChannelRecord[] {
    return aigwStore.channels
      .filter((item) => item.status === "ACTIVE" && item.models.includes(model))
      .sort((a, b) => b.priority - a.priority || b.weight - a.weight)
  }

  static markOk(channelId: string) {
    const ch = aigwStore.channels.find((c) => c.id === channelId)
    if (ch) ch.failCount = 0
    void this.recordSuccess(channelId)
  }

  static markFail(channelId: string) {
    const ch = aigwStore.channels.find((c) => c.id === channelId)
    if (ch) {
      ch.failCount++
      if (ch.autoDisable && ch.failCount >= 3) ch.status = "DISABLED"
    }
    void this.recordFailure(channelId)
  }

  static async listActiveModels(): Promise<string[]> {
    const names = new Set<string>()
    const all = await AigwChannelRepository.findAll({ status: "ACTIVE" })
    for (const channel of all) {
      for (const model of channel.models) names.add(model)
    }
    return [...names]
  }

  static async recordFailure(channelId: string) {
    const channel = await AigwChannelRepository.findById(channelId)
    if (!channel) return
    const failCount = (channel.failCount ?? 0) + 1
    const nextStatus = channel.autoDisable && failCount >= 3 ? "DISABLED" : channel.status
    await AigwChannelRepository.update(channelId, { failCount, status: nextStatus })
    if (nextStatus === "DISABLED") {
      domainLog.audit("aigw.channel.autoDisabled", { targetType: "AIGW_CHANNEL", targetId: channelId, failCount })
    }
  }

  static async recordSuccess(channelId: string) {
    const channel = await AigwChannelRepository.findById(channelId)
    if (!channel) return
    if ((channel.failCount ?? 0) > 0) {
      await AigwChannelRepository.update(channelId, { failCount: 0 })
    }
  }
}

function toPublic(record: AigwChannelRow) {
  return {
    id: record.id,
    name: record.name,
    provider: record.provider,
    baseUrl: record.baseUrl,
    apiKeyMasked: maskSecret(record.apiKey),
    models: record.models,
    modelMap: record.modelMap,
    weight: record.weight,
    priority: record.priority,
    status: record.status,
    autoDisable: record.autoDisable,
    failCount: record.failCount,
    protocol: record.protocol,
    createdAt: record.createdAt,
  }
}

function assertChannelStatus(from: "ACTIVE" | "DISABLED", to: "ACTIVE" | "DISABLED") {
  if (from === to) return
  if (from === "ACTIVE" && to === "DISABLED") return
  if (from === "DISABLED" && to === "ACTIVE") return
  throw new Error(`非法渠道状态转换: ${from} -> ${to}`)
}

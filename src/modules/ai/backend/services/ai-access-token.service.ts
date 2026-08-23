import { randomBytes } from "node:crypto"
import { domainLog } from "@/modules/shared/backend/lib/domain-log"
import { aiGatewayStore, maskSecret, type AiAccessTokenRecord } from "./ai-gateway.store"

export type AiAccessTokenWriteInput = {
  name: string
  remainQuota?: number
  unlimited?: boolean
  models?: string[]
  ipAllowlist?: string[]
  group?: string
  expiresAt?: string
}

export class AiAccessTokenService {
  static async page(input: { page: number; pageSize: number; keyword?: string }) {
    let rows = [...aiGatewayStore.tokens]
    if (input.keyword) {
      const kw = input.keyword.toLowerCase()
      rows = rows.filter((item) => item.name.toLowerCase().includes(kw))
    }
    const start = (input.page - 1) * input.pageSize
    domainLog.event("ai.token.page", { page: input.page, total: rows.length })
    return {
      items: rows.slice(start, start + input.pageSize).map((item) => ({ ...item, key: maskSecret(item.key) })),
      total: rows.length,
      page: input.page,
      pageSize: input.pageSize,
    }
  }

  static async create(input: AiAccessTokenWriteInput) {
    if (aiGatewayStore.tokens.some((item) => item.name === input.name)) throw new Error("令牌名称已存在")
    const key = `sk-ruoyi-${randomBytes(12).toString("hex")}`
    const record: AiAccessTokenRecord = {
      id: aiGatewayStore.nextTokenId(),
      name: input.name,
      key,
      status: "ACTIVE",
      remainQuota: input.remainQuota ?? 100_000,
      unlimited: input.unlimited ?? false,
      models: input.models ?? [],
      ipAllowlist: input.ipAllowlist ?? [],
      group: input.group ?? "default",
      expiresAt: input.expiresAt,
      createdAt: new Date().toISOString(),
    }
    aiGatewayStore.tokens.push(record)
    domainLog.audit("ai.token.create", { targetType: "AI_TOKEN", targetId: record.id })
    return { id: record.id, key }
  }

  static async update(input: { id: string; status?: "ACTIVE" | "DISABLED"; remainQuota?: number; models?: string[] }) {
    const record = aiGatewayStore.tokens.find((item) => item.id === input.id)
    if (!record) throw new Error("令牌不存在")
    if (input.status) record.status = input.status
    if (input.remainQuota !== undefined) record.remainQuota = input.remainQuota
    if (input.models) record.models = input.models
    domainLog.audit("ai.token.update", { targetType: "AI_TOKEN", targetId: record.id })
    return true
  }

  static async delete(id: string) {
    const index = aiGatewayStore.tokens.findIndex((item) => item.id === id)
    if (index === -1) throw new Error("令牌不存在")
    aiGatewayStore.tokens.splice(index, 1)
    domainLog.audit("ai.token.delete", { targetType: "AI_TOKEN", targetId: id })
    return true
  }

  static findByKey(key: string): AiAccessTokenRecord | undefined {
    return aiGatewayStore.tokens.find((item) => item.key === key)
  }

  static assertUsable(key: string, opts?: { model?: string; clientIp?: string }): AiAccessTokenRecord {
    const token = this.findByKey(key)
    if (!token || token.status !== "ACTIVE") {
      throw Object.assign(new Error("令牌无效或已停用"), { status: 401 })
    }
    if (token.expiresAt && Date.parse(token.expiresAt) < Date.now()) {
      throw Object.assign(new Error("令牌已过期"), { status: 401 })
    }
    if (!token.unlimited && token.remainQuota <= 0) {
      throw Object.assign(new Error("令牌额度不足"), { status: 403 })
    }
    if (opts?.model && token.models.length > 0 && !token.models.includes(opts.model)) {
      throw Object.assign(new Error("令牌无权调用该模型"), { status: 403 })
    }
    if (token.ipAllowlist.length > 0 && opts?.clientIp && !token.ipAllowlist.includes(opts.clientIp)) {
      throw Object.assign(new Error("来源 IP 不在白名单"), { status: 403 })
    }
    return token
  }

  static consume(id: string, used: number) {
    const record = aiGatewayStore.tokens.find((item) => item.id === id)
    if (!record || record.unlimited) return
    record.remainQuota = Math.max(0, record.remainQuota - used)
  }
}

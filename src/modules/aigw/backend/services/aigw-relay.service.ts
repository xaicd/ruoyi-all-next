import { AigwAccessTokenService } from "./aigw-access-token.service"
import { AigwChannelService } from "./aigw-channel.service"
import { AigwUsageService } from "./aigw-usage.service"
import type { AigwChannelRecord } from "./aigw.store"

export type ChatMessage = { role: string; content: string }

export type RelayChatInput = {
  apiKey: string
  model: string
  messages: ChatMessage[]
  stream?: boolean
  clientIp?: string
}

export class AigwRelayService {
  static async relayChatCompletion(input: RelayChatInput) {
    const token = AigwAccessTokenService.assertUsable(input.apiKey, {
      model: input.model,
      clientIp: input.clientIp,
    })
    if (input.stream) {
      throw Object.assign(new Error("流式输出一期未开放"), { status: 400 })
    }

    const channels = AigwChannelService.pick(input.model)
    if (channels.length === 0) {
      throw Object.assign(new Error("没有可用上游渠道"), { status: 503 })
    }

    let lastError = "上游全部失败"
    for (const channel of channels) {
      const started = Date.now()
      try {
        const result = await invokeChannel(channel, input)
        const used = result.usage.prompt_tokens + result.usage.completion_tokens
        AigwAccessTokenService.consume(token.id, used)
        AigwChannelService.markOk(channel.id)
        void AigwUsageService.record({
          tokenId: token.id,
          channelId: channel.id,
          model: input.model,
          promptTokens: result.usage.prompt_tokens,
          completionTokens: result.usage.completion_tokens,
          totalTokens: used,
          success: true,
          latencyMs: Date.now() - started,
        })
        return result
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
        AigwChannelService.markFail(channel.id)
        void AigwUsageService.record({
          tokenId: token.id,
          channelId: channel.id,
          model: input.model,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          success: false,
          latencyMs: Date.now() - started,
          error: lastError,
        })
      }
    }

    throw Object.assign(new Error(`上游重试均失败: ${lastError}`), { status: 502 })
  }

  static listPublicModels() {
    return AigwChannelService.listActiveModels()
  }

  static embed(input: { apiKey: string; model?: string; input: string | string[] }) {
    const model = input.model || "mock-chat"
    const token = AigwAccessTokenService.assertUsable(input.apiKey, { model })
    const text = Array.isArray(input.input) ? input.input.join(" ") : input.input
    const promptTokens = estimateTokens(text)
    AigwAccessTokenService.consume(token.id, promptTokens)
    void AigwUsageService.record({
      tokenId: token.id,
      channelId: "ch-mock-001",
      model,
      promptTokens,
      completionTokens: 0,
      totalTokens: promptTokens,
      success: true,
      latencyMs: 1,
    })
    return {
      object: "list",
      data: [{ object: "embedding", index: 0, embedding: [0.001, 0.002, 0.003] }],
      model,
      usage: { prompt_tokens: promptTokens, total_tokens: promptTokens },
    }
  }
}

async function invokeChannel(channel: AigwChannelRecord, input: RelayChatInput) {
  if (channel.provider === "MOCK") {
    const last = input.messages[input.messages.length - 1]?.content ?? "Hello"
    const promptTokens = estimateTokens(input.messages.map((m) => m.content).join(" "))
    const reply = `[Mock ${input.model}] 收到: ${last.slice(0, 100)}`
    const completionTokens = estimateTokens(reply)
    return {
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: input.model,
      choices: [{ index: 0, message: { role: "assistant", content: reply }, finish_reason: "stop" }],
      usage: { prompt_tokens: promptTokens, completion_tokens: completionTokens, total_tokens: promptTokens + completionTokens },
    }
  }

  const targetModel = channel.modelMap[input.model] || input.model
  const base = channel.baseUrl.replace(/\/+$/, "")
  const url = `${base}/chat/completions`
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channel.apiKey}`,
    },
    body: JSON.stringify({ model: targetModel, messages: input.messages }),
  })
  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Upstream HTTP ${resp.status}: ${body.slice(0, 200)}`)
  }
  return resp.json()
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 2))
}

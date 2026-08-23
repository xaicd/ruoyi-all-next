import { AiAccessTokenService } from "./ai-access-token.service"
import { AiChannelService } from "./ai-channel.service"
import { AiUsageService } from "./ai-usage.service"
import type { AiChannelRecord } from "./ai-gateway.store"

export type ChatMessage = { role: string; content: string }

export type RelayChatInput = {
  apiKey: string
  model: string
  messages: ChatMessage[]
  stream?: boolean
  clientIp?: string
}

export class AiGatewayRelayService {
  static async relayChatCompletion(input: RelayChatInput) {
    const token = AiAccessTokenService.assertUsable(input.apiKey, {
      model: input.model,
      clientIp: input.clientIp,
    })
    if (input.stream) {
      throw Object.assign(new Error("流式输出一期未开放"), { status: 400 })
    }

    const channels = AiChannelService.pick(input.model)
    if (channels.length === 0) {
      throw Object.assign(new Error("没有可用上游渠道"), { status: 503 })
    }

    let lastError = "上游全部失败"
    for (const channel of channels) {
      const started = Date.now()
      try {
        const result = await invokeChannel(channel, input)
        const used = result.usage.prompt_tokens + result.usage.completion_tokens
        AiAccessTokenService.consume(token.id, used)
        AiChannelService.markOk(channel.id)
        AiUsageService.record({
          tokenId: token.id,
          channelId: channel.id,
          model: input.model,
          promptTokens: result.usage.prompt_tokens,
          completionTokens: result.usage.completion_tokens,
          success: true,
          latencyMs: Date.now() - started,
        })
        return result
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
        AiChannelService.markFail(channel.id)
        AiUsageService.record({
          tokenId: token.id,
          channelId: channel.id,
          model: input.model,
          promptTokens: 0,
          completionTokens: 0,
          success: false,
          latencyMs: Date.now() - started,
          error: lastError,
        })
      }
    }
    throw Object.assign(new Error(lastError), { status: 502 })
  }

  static listPublicModels() {
    return {
      object: "list" as const,
      data: AiChannelService.listActiveModels().map((id) => ({ id, object: "model" as const, owned_by: "ruoyi-ai" })),
    }
  }
}

async function invokeChannel(channel: AiChannelRecord, input: RelayChatInput) {
  const upstreamModel = channel.modelMap[input.model] || input.model
  if (channel.provider === "MOCK" || !channel.baseUrl) {
    const prompt = input.messages.map((item) => item.content).join("\n").slice(0, 200)
    const text = `[mock:${channel.name}] ${prompt || "ok"}`
    return openaiChatShape(input.model, text, estimateTokens(prompt), estimateTokens(text))
  }

  const url = `${channel.baseUrl.replace(/\/+$/, "")}/v1/chat/completions`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${channel.apiKey}`,
    },
    body: JSON.stringify({
      model: upstreamModel,
      messages: input.messages,
      stream: false,
    }),
    signal: AbortSignal.timeout(8_000),
  })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`上游 ${channel.name} ${response.status}: ${body.slice(0, 200)}`)
  }
  return (await response.json()) as ReturnType<typeof openaiChatShape>
}

function openaiChatShape(model: string, content: string, promptTokens: number, completionTokens: number) {
  return {
    id: `chatcmpl-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }],
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    },
  }
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4))
}

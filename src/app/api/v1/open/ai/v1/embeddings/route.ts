import { NextResponse } from "next/server"
import { AiAccessTokenService } from "@/modules/ai/backend/services/ai-access-token.service"
import { AiChannelService } from "@/modules/ai/backend/services/ai-channel.service"

function readApiKey(request: Request): string {
  const header = request.headers.get("authorization") || ""
  const match = /^Bearer\s+(.+)$/i.exec(header)
  return match?.[1]?.trim() || request.headers.get("x-api-key")?.trim() || ""
}

function fail(error: unknown) {
  const status =
    typeof error === "object" && error && "status" in error ? Number((error as { status: number }).status) : 400
  const message = error instanceof Error ? error.message : "请求失败"
  return NextResponse.json(
    { error: { message, type: "invalid_request_error" } },
    { status: Number.isFinite(status) ? status : 400 },
  )
}

export async function POST(request: Request) {
  try {
    const apiKey = readApiKey(request)
    if (!apiKey) {
      return NextResponse.json({ error: { message: "缺少令牌" } }, { status: 401 })
    }
    const body = await request.json()
    const model = String(body.model || "mock-chat")
    AiAccessTokenService.assertUsable(apiKey, { model })
    const input = String(Array.isArray(body.input) ? body.input.join(" ") : body.input || "")
    const promptTokens = Math.max(1, Math.ceil(input.length / 4))
    return NextResponse.json({
      object: "list",
      data: [
        {
          object: "embedding",
          index: 0,
          embedding: Array.from({ length: 8 }, (_, index) => Number(((index + 1) / 10).toFixed(4))),
        },
      ],
      model,
      usage: { prompt_tokens: promptTokens, total_tokens: promptTokens },
    })
  } catch (error) {
    return fail(error)
  }
}

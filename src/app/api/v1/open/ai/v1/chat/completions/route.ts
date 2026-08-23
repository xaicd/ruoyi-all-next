import { NextResponse } from "next/server"
import { AiGatewayRelayService } from "@/modules/ai/backend/services/ai-gateway-relay.service"

function readApiKey(request: Request): string {
  const header = request.headers.get("authorization") || ""
  const match = /^Bearer\s+(.+)$/i.exec(header)
  if (match?.[1]) return match[1].trim()
  return request.headers.get("x-api-key")?.trim() || ""
}

function clientIp(request: Request): string | undefined {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined
}

function fail(error: unknown) {
  const status = typeof error === "object" && error && "status" in error ? Number((error as { status: number }).status) : 400
  const message = error instanceof Error ? error.message : "请求失败"
  return NextResponse.json({ error: { message, type: "invalid_request_error" } }, { status: Number.isFinite(status) ? status : 400 })
}

export async function POST(request: Request) {
  try {
    const apiKey = readApiKey(request)
    const body = await request.json()
    const data = await AiGatewayRelayService.relayChatCompletion({
      apiKey,
      model: String(body.model || ""),
      messages: Array.isArray(body.messages) ? body.messages : [],
      stream: Boolean(body.stream),
      clientIp: clientIp(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    return fail(error)
  }
}

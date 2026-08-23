import { NextResponse } from "next/server"
import { AiGatewayRelayService } from "@/modules/ai/backend/services/ai-gateway-relay.service"
import { aiRelayChatSchema } from "@/modules/ai/backend/validators"
import { clientIp, readOpenApiKey } from "@/modules/ai/backend/lib/open-api-key"

function fail(error: unknown) {
  const status = typeof error === "object" && error && "status" in error ? Number((error as { status: number }).status) : 400
  const message = error instanceof Error ? error.message : "请求失败"
  return NextResponse.json({ error: { message, type: "invalid_request_error" } }, { status: Number.isFinite(status) ? status : 400 })
}

export async function POST(request: Request) {
  try {
    const apiKey = readOpenApiKey(request)
    if (!apiKey) {
      return NextResponse.json({ error: { message: "缺少令牌", type: "invalid_request_error" } }, { status: 401 })
    }
    const body = aiRelayChatSchema.parse(await request.json())
    const data = await AiGatewayRelayService.relayChatCompletion({
      apiKey,
      model: body.model,
      messages: body.messages,
      stream: body.stream,
      clientIp: clientIp(request),
    })
    return NextResponse.json(data)
  } catch (error) {
    return fail(error)
  }
}

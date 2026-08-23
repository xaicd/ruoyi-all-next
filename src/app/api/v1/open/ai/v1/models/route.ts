import { NextResponse } from "next/server"
import { AiAccessTokenService } from "@/modules/ai/backend/services/ai-access-token.service"
import { AiGatewayRelayService } from "@/modules/ai/backend/services/ai-gateway-relay.service"
import { readOpenApiKey } from "@/modules/ai/backend/lib/open-api-key"

export async function GET(request: Request) {
  const apiKey = readOpenApiKey(request)
  if (!apiKey) {
    return NextResponse.json({ error: { message: "缺少令牌" } }, { status: 401 })
  }
  try {
    AiAccessTokenService.assertUsable(apiKey)
    return NextResponse.json(AiGatewayRelayService.listPublicModels())
  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error ? Number((error as { status: number }).status) : 401
    const message = error instanceof Error ? error.message : "令牌无效"
    return NextResponse.json({ error: { message } }, { status: Number.isFinite(status) ? status : 401 })
  }
}

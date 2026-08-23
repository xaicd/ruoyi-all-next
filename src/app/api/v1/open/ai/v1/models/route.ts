import { NextResponse } from "next/server"
import { AigwAccessTokenService, AigwRelayService } from "@/modules/aigw/backend/services"
import { readOpenApiKey } from "@/modules/ai/backend/lib/open-api-key"

export async function GET(request: Request) {
  const apiKey = readOpenApiKey(request)
  if (!apiKey) {
    return NextResponse.json({ error: { message: "缺少令牌" } }, { status: 401 })
  }
  try {
    AigwAccessTokenService.assertUsable(apiKey)
    return NextResponse.json(AigwRelayService.listPublicModels())

  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error ? Number((error as { status: number }).status) : 401
    const message = error instanceof Error ? error.message : "令牌无效"
    return NextResponse.json({ error: { message } }, { status: Number.isFinite(status) ? status : 401 })
  }
}

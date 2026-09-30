import { NextResponse } from "next/server"
import { AigwRelayService } from "@/modules/aigw/backend/services"
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
    const data = await AigwRelayService.relayChatCompletion({
      apiKey,
      model: body.model,
      messages: body.messages as any,
      stream: body.stream,
      clientIp: clientIp(request),
    })

    return NextResponse.json(data)

  } catch (error) {
    return fail(error)
  }
}

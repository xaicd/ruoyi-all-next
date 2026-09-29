import { NextResponse } from "next/server"
import { AigwRelayService } from "@/modules/aigw/backend/services/aigw-relay.service"
import { aigwRelayChatSchema } from "@/modules/aigw/backend/validators"

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.replace(/^Bearer\s+/i, "")
  if (!token) {
    return NextResponse.json({ error: { message: "缺少 Authorization Bearer 令牌", type: "invalid_request_error" } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = aigwRelayChatSchema.parse({
      apiKey: token,
      model: body.model,
      messages: body.messages,
      stream: body.stream,
    })
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    const result = await AigwRelayService.relayChatCompletion({
      apiKey: token,
      model: parsed.model,
      messages: parsed.messages as any,
      stream: parsed.stream,
      clientIp,
    })
    return NextResponse.json(result)

  } catch (err: any) {
    const status = err.status || 500
    return NextResponse.json({ error: { message: err.message || "网关转发异常", type: "api_error" } }, { status })
  }
}

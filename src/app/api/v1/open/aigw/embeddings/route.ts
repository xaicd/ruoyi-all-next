import { NextResponse } from "next/server"
import { AigwRelayService } from "@/modules/aigw/backend/services/aigw-relay.service"

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") || ""
  const token = authHeader.replace(/^Bearer\s+/i, "")
  if (!token) {
    return NextResponse.json({ error: { message: "缺少 Authorization Bearer 令牌", type: "invalid_request_error" } }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = AigwRelayService.embed({
      apiKey: token,
      model: body.model,
      input: body.input,
    })
    return NextResponse.json(result)
  } catch (err: any) {
    const status = err.status || 500
    return NextResponse.json({ error: { message: err.message || "Embedding 向量生成异常", type: "api_error" } }, { status })
  }
}
